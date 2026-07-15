using Cms.Api.DTOs.Image;
using Cms.Api.Services.Interfaces;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.Helpers;
using Cms.Api.Configurations;
using Microsoft.Extensions.Options;

namespace Cms.Api.Services;

public class ImageService : IImageService
{
    // Private types
    private readonly IImageRepository _imageRepository;
    private readonly IImageStorageService _imageStorageService;
    private readonly ImageUploadSettings _imageUploadSettings;
    private readonly ILogger<ImageService> _logger;

    // Constructor
    public ImageService(
        IImageRepository imageRepository,
        IImageStorageService imageStorageService,
        IOptions<ImageUploadSettings> imageUploadSettings,
        ILogger<ImageService> logger)
    {
        _imageRepository = imageRepository;
        _imageStorageService = imageStorageService;
        _imageUploadSettings = imageUploadSettings.Value;
        _logger = logger;
    }

    // Validation Helpers
    private static async Task ValidateImageSignatureAsync(IFormFile file)
    {
        var header = new byte[12];

        await using var stream = file.OpenReadStream();
        var bytesRead = await stream.ReadAsync(header);

        var isJpeg = bytesRead >= 3 &&
                    header[0] == 0xFF &&
                    header[1] == 0xD8 &&
                    header[2] == 0xFF;

        var isPng = bytesRead >= 8 &&
                    header[0] == 0x89 &&
                    header[1] == 0x50 &&
                    header[2] == 0x4E &&
                    header[3] == 0x47 &&
                    header[4] == 0x0D &&
                    header[5] == 0x0A &&
                    header[6] == 0x1A &&
                    header[7] == 0x0A;

        var isWebp = bytesRead >= 12 &&
                    header[0] == (byte)'R' &&
                    header[1] == (byte)'I' &&
                    header[2] == (byte)'F' &&
                    header[3] == (byte)'F' &&
                    header[8] == (byte)'W' &&
                    header[9] == (byte)'E' &&
                    header[10] == (byte)'B' &&
                    header[11] == (byte)'P';

        if (!isJpeg && !isPng && !isWebp)
        {
            throw new ArgumentException(
                "The uploaded file is not a valid JPEG, PNG, or WEBP image.");
        }
    }

    // Public methods
    public async Task<List<DefaultImageDto>> GetDefaultImagesAsync(int categoryId)
    {
        _ = ImageFolderHelper.GetFolder(categoryId);

        var images = await _imageRepository.GetDefaultImagesByCategoryAsync(categoryId);

        return images
            .Select(image => new DefaultImageDto
            {
                Id = image.Id,
                FilePath = image.FilePath
            })
            .ToList();
    }

    public async Task<UploadImageResponseDto> UploadAsync(
        IFormFile file,
        int categoryId)
    {
        if (file is null)
        {
            throw new ArgumentException("No file uploaded.");
        }

        if (file.Length == 0)
        {
            throw new ArgumentException("Image file is empty.");
        }

        if (file.Length > _imageUploadSettings.MaxFileSize)
        {
            throw new ArgumentException("Image size cannot exceed 5 MB.");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!_imageUploadSettings.AllowedExtensions.Contains(extension))
        {
            throw new ArgumentException("Only JPG, JPEG, PNG and WEBP images are allowed.");
        }

        if (!_imageUploadSettings.AllowedContentTypes.Contains(file.ContentType))
        {
            throw new ArgumentException(
                "Only JPG, JPEG, PNG and WEBP images are allowed.");
        }

        await ValidateImageSignatureAsync(file);

        var folder = ImageFolderHelper.GetFolder(categoryId);

        var storedImage = await _imageStorageService.SaveAsync(file, folder);

        var image = new Image
        {
            Type = ImageType.Custom,
            CategoryId = categoryId,
            FilePath = storedImage.Url,
            StoragePublicId = storedImage.PublicId
        };

        try
        {
            await _imageRepository.AddAsync(image);
            await _imageRepository.SaveChangesAsync();
        }
        catch
        {
            try
            {
                await _imageStorageService.DeleteAsync(storedImage.PublicId);
            }
            catch (Exception cleanupException)
            {
                _logger.LogError(
                    cleanupException,
                    "Failed to delete orphaned stored image {PublicId}.",
                    storedImage.PublicId);
            }

            throw;
        }

        return new UploadImageResponseDto
        {
            Id = image.Id,
            FilePath = image.FilePath
        };
    }
}
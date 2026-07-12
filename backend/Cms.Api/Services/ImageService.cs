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

    // Constructor
    public ImageService(
        IImageRepository imageRepository,
        IImageStorageService imageStorageService,
        IOptions<ImageUploadSettings> imageUploadSettings)
    {
        _imageRepository = imageRepository;
        _imageStorageService = imageStorageService;
        _imageUploadSettings = imageUploadSettings.Value;
    }

    // Public methods
    public async Task<List<DefaultImageDto>> GetDefaultImagesAsync(int categoryId)
    {
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

        var folder = ImageFolderHelper.GetFolder(categoryId);

        var imageUrl = await _imageStorageService.SaveAsync(file, folder);

        var image = new Image
        {
            Type = ImageType.Custom,
            CategoryId = categoryId,
            FilePath = imageUrl
        };

        await _imageRepository.AddAsync(image);
        await _imageRepository.SaveChangesAsync();

        return new UploadImageResponseDto
        {
            Id = image.Id,
            FilePath = image.FilePath
        };
    }
}
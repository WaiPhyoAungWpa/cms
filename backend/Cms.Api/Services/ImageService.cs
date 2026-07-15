using Cms.Api.DTOs.Image;
using Cms.Api.Services.Interfaces;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.Helpers;
using Cms.Api.Configurations;
using Microsoft.Extensions.Options;
using ImageMagick;

namespace Cms.Api.Services;

public class ImageService : IImageService
{
    // Private types
    private readonly IImageRepository _imageRepository;
    private readonly IImageStorageService _imageStorageService;
    private readonly ImageUploadSettings _imageUploadSettings;
    private readonly ILogger<ImageService> _logger;

    private static readonly IReadOnlyDictionary<string, (string MimeType, MagickFormat Format)>
        SupportedImageFormats =
            new Dictionary<string, (string MimeType, MagickFormat Format)>(
                StringComparer.OrdinalIgnoreCase)
            {
                [".jpg"] = ("image/jpeg", MagickFormat.Jpeg),
                [".jpeg"] = ("image/jpeg", MagickFormat.Jpeg),
                [".png"] = ("image/png", MagickFormat.Png),
                [".webp"] = ("image/webp", MagickFormat.WebP)
            };

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
    private static async Task ValidateDecodedImageAsync(
        IFormFile file,
        string extension,
        CancellationToken cancellationToken = default)
    {
        if (!SupportedImageFormats.TryGetValue(extension, out var expectedFormat))
        {
            throw new ArgumentException(
                "Only JPG, JPEG, PNG and WEBP images are allowed.");
        }

        if (!string.Equals(
                file.ContentType,
                expectedFormat.MimeType,
                StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "The file extension and declared content type must match.");
        }

        await using var uploadStream = file.OpenReadStream();
        using var buffer = new MemoryStream();

        await uploadStream.CopyToAsync(buffer, cancellationToken);

        var bytes = buffer.ToArray();

        ValidateImageContainer(bytes, expectedFormat.Format);

        try
        {
            using var image = new MagickImage(bytes);

            if (image.Format != expectedFormat.Format)
            {
                throw new ArgumentException(
                    "The file extension, declared content type, and detected image format must match.");
            }
        }
        catch (MagickException)
        {
            throw new ArgumentException(
                "The uploaded file is not a valid, complete image.");
        }
    }

    private static void ValidateImageContainer(
        byte[] bytes,
        MagickFormat expectedFormat)
    {
        var isComplete = expectedFormat switch
        {
            MagickFormat.Jpeg =>
                bytes.Length >= 4 &&
                bytes[^2] == 0xFF &&
                bytes[^1] == 0xD9,

            MagickFormat.Png =>
                bytes.Length >= 8 &&
                bytes[^8..].SequenceEqual(
                    new byte[] { 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 }),

            MagickFormat.WebP =>
                bytes.Length >= 12 &&
                bytes[0..4].SequenceEqual("RIFF"u8) &&
                bytes[8..12].SequenceEqual("WEBP"u8) &&
                BitConverter.ToUInt32(bytes, 4) == bytes.Length - 8,

            _ => false
        };

        if (!isComplete)
        {
            throw new ArgumentException(
                "The uploaded file is not a valid, complete image.");
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

        await ValidateDecodedImageAsync(file, extension);

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
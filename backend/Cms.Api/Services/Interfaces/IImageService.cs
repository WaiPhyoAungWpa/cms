using Cms.Api.DTOs.Image;

namespace Cms.Api.Services.Interfaces;

/// <summary>
/// Defines image management operations.
/// </summary>
public interface IImageService
{
    /// <summary>
    /// Retrieves the default images for a category.
    /// </summary>
    Task<List<DefaultImageDto>> GetDefaultImagesAsync(int categoryId);

    /// <summary>
    /// Uploads a custom image.
    /// </summary>
    Task<UploadImageResponseDto> UploadAsync(
        IFormFile file,
        int categoryId);
}
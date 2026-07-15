namespace Cms.Api.Services.Interfaces;

/// <summary>
/// Defines image storage operations.
/// </summary>
public interface IImageStorageService
{
    /// <summary>
    /// Saves an image to the configured storage provider.
    /// </summary>
    Task<StoredImage> SaveAsync(
        IFormFile file,
        string folder);

    Task DeleteAsync(string publicId);
}
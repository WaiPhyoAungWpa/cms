namespace Cms.Api.Services.Interfaces;

/// <summary>
/// Defines image storage operations.
/// </summary>
public interface IImageStorageService
{
    /// <summary>
    /// Saves an image to the configured storage provider.
    /// </summary>
    Task<string> SaveAsync(
        IFormFile file,
        string folder);

}
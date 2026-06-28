public interface IImageStorageService
{
    Task<string> SaveAsync(
        IFormFile file,
        string folder);

    Task DeleteAsync(string filePath);
}
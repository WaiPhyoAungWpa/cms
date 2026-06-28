using Microsoft.AspNetCore.Http;

namespace Cms.Api.Services.Interfaces;

public interface IImageStorageService
{
    Task<string> SaveAsync(IFormFile file);

    Task DeleteAsync(string filePath);
}
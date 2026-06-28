using Microsoft.AspNetCore.Http;
using Cms.Api.Services.Interfaces;

namespace Cms.Api.Services;

public class CloudinaryImageStorageService : IImageStorageService
{
    public Task<string> SaveAsync(IFormFile file)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(string filePath)
    {
        throw new NotImplementedException();
    }
}
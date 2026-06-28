using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Cms.Api.Configurations;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Cms.Api.Services;

public class CloudinaryImageStorageService : IImageStorageService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryImageStorageService(
        IOptions<CloudinarySettings> options)
    {
        var settings = options.Value;

        var account = new Account(
            settings.CloudName,
            settings.ApiKey,
            settings.ApiSecret);

        _cloudinary = new Cloudinary(account)
        {
            Api = { Secure = true }
        };
    }

    public async Task<string> SaveAsync(
        IFormFile file,
        string folder)
    {
        using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception(result.Error.Message);

        return result.SecureUrl.ToString();
    }

    public async Task DeleteAsync(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
        {
            return;
        }

        var uri = new Uri(filePath);

        var segments = uri.AbsolutePath.Split('/');

        var uploadIndex = Array.IndexOf(segments, "upload");

        if (uploadIndex == -1)
        {
            return;
        }

        var publicId = string.Join(
            "/",
            segments[(uploadIndex + 2)..]);

        publicId = Path.ChangeExtension(publicId, null);

        var deleteParams = new DeletionParams(publicId);

        await _cloudinary.DestroyAsync(deleteParams);
    }
}
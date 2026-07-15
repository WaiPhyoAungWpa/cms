using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Cms.Api.Configurations;
using Cms.Api.Exceptions;
using Cms.Api.Services.Interfaces;
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

    public async Task<StoredImage> SaveAsync(
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
        {
            throw new ExternalServiceException(
                $"Cloudinary image upload failed: {result.Error.Message}");
        }

        if (string.IsNullOrWhiteSpace(result.PublicId))
        {
            throw new ExternalServiceException(
                "Cloudinary image upload did not return a public identifier.");
        }

        return new StoredImage(
            result.SecureUrl.ToString(),
            result.PublicId);
    }

    public async Task DeleteAsync(string publicId)
    {
        var deletionParams = new DeletionParams(publicId);

        var result = await _cloudinary.DestroyAsync(deletionParams);

        if (result.Error != null)
        {
            throw new ExternalServiceException(
                $"Cloudinary image deletion failed: {result.Error.Message}");
        }

        if (result.Result is not "ok" and not "not found")
        {
            throw new ExternalServiceException(
                $"Cloudinary image deletion returned: {result.Result}");
        }
    }

}
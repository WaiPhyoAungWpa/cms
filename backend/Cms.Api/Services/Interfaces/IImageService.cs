using Cms.Api.DTOs.Image;
using Microsoft.AspNetCore.Http;

namespace Cms.Api.Services.Interfaces;

public interface IImageService
{
    Task<List<DefaultImageDto>> GetDefaultImagesAsync(int categoryId);

    Task<UploadImageResponseDto> UploadAsync(
        IFormFile file,
        int categoryId);
}
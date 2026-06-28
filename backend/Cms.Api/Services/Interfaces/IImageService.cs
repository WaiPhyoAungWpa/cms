using Cms.Api.DTOs.Image;

namespace Cms.Api.Services.Interfaces;

public interface IImageService
{
    Task<List<DefaultImageDto>> GetDefaultImagesAsync(int categoryId);
}
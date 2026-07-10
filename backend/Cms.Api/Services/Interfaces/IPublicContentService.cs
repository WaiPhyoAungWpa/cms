using Cms.Api.DTOs.PublicContent;

namespace Cms.Api.Services.Interfaces;

public interface IPublicContentService
{
    Task<PublicContentListResponseDto> GetAllAsync(
        PublicContentQueryRequestDto request);
}
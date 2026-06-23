using Cms.Api.DTOs.Content;

namespace Cms.Api.Services;

public interface IContentService
{
    Task<ContentResponseDto> PublishAsync(CreateContentRequestDto request);

    Task<ContentResponseDto> SaveDraftAsync(CreateContentRequestDto request);
}
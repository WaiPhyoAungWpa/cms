using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.Common;

namespace Cms.Api.Services.Interfaces;

public interface IContentService
{
    Task<ContentResponseDto> PublishAsync(CreateContentRequestDto request);

    Task<ContentResponseDto> SaveDraftAsync(CreateContentRequestDto request);

    Task<PagedResponseDto<ContentListResponseDto>>
        GetAllAsync(ContentQueryRequestDto request);

}
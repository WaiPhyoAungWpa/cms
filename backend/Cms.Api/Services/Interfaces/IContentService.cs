using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.Common;

namespace Cms.Api.Services.Interfaces;

public interface IContentService
{
    Task<ContentResponseDto> PublishAsync(CreateContentRequestDto request);

    Task<ContentResponseDto> SaveDraftAsync(CreateContentRequestDto request);

    Task<PagedResponseDto<ContentListResponseDto>>
        GetAllAsync(ContentQueryRequestDto request);

    Task<ContentDetailResponseDto> GetByIdAsync(int id);

    Task<ContentResponseDto> UpdateDraftAsync(
        int id,
        UpdateContentRequestDto request);

    Task<ContentResponseDto> PublishDraftAsync(
        int id,
        UpdateContentRequestDto request);

    Task<ContentResponseDto> UpdatePublishedAsync(
        int id,
        UpdateContentRequestDto request);

    Task<ContentResponseDto> SoftDeleteAsync(int id);

}
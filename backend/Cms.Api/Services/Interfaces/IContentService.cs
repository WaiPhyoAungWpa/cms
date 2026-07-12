using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.Common;
using Cms.Api.DTOs.Dashboard;

namespace Cms.Api.Services.Interfaces;

/// <summary>
/// Defines operations for managing administrator content.
/// </summary>
public interface IContentService
{
    /// <summary>
    /// Publishes a new content item.
    /// </summary>
    /// <param name="request">The content creation request.</param>
    /// <returns>The published content.</returns>
    Task<ContentResponseDto> PublishAsync(CreateContentRequestDto request);

    /// <summary>
    /// Saves a new content item as a draft.
    /// </summary>
    Task<ContentResponseDto> SaveDraftAsync(CreateContentRequestDto request);

    /// <summary>
    /// Retrieves a paginated list of content items.
    /// </summary>
    Task<PagedResponseDto<ContentListResponseDto>>
        GetAllAsync(ContentQueryRequestDto request);

    /// <summary>
    /// Retrieves the details of a content item.
    /// </summary>
    Task<ContentDetailResponseDto> GetByIdAsync(int id);

    /// <summary>
    /// Updates an existing draft.
    /// </summary>
    Task<ContentResponseDto> UpdateDraftAsync(
        int id,
        UpdateContentRequestDto request);

    /// <summary>
    /// Publishes an existing draft.
    /// </summary>
    Task<ContentResponseDto> PublishDraftAsync(
        int id,
        UpdateContentRequestDto request);

    /// <summary>
    /// Updates an existing published content item.
    /// </summary>
    Task<ContentResponseDto> UpdatePublishedAsync(
        int id,
        UpdateContentRequestDto request);

    /// <summary>
    /// Soft-deletes a content item.
    /// </summary>
    Task<ContentResponseDto> SoftDeleteAsync(int id);

    /// <summary>
    /// Restores a previously soft-deleted content item.
    /// </summary>
    Task<ContentResponseDto> RestoreAsync(
        int id,
        RestoreContentRequestDto request);

    /// <summary>
    /// Retrieves the administrator dashboard summary.
    /// </summary>
    Task<DashboardSummaryResponseDto> GetDashboardSummaryAsync();

}
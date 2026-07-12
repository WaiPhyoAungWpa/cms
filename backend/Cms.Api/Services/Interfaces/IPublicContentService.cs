using Cms.Api.DTOs.PublicContent;

namespace Cms.Api.Services.Interfaces;

/// <summary>
/// Defines operations for retrieving publicly visible content.
/// </summary>
public interface IPublicContentService
{
    /// <summary>
    /// Retrieves a paginated list of published public content.
    /// </summary>
    Task<PublicContentListResponseDto> GetAllAsync(
        PublicContentQueryRequestDto request);

    /// <summary>
    /// Retrieves the details of a published public content item.
    /// </summary>
    Task<PublicContentDetailResponseDto> GetByIdAsync(int id);
}
using Cms.Api.Entities;
using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.PublicContent;

namespace Cms.Api.Repositories.Interfaces;

public interface IContentRepository
{
    // Persistence
    Task AddAsync(Content content);
    Task SaveChangesAsync();

    // Admin content
    Task<(List<Content> Items, int TotalCount)> GetAllAsync(
        ContentQueryRequestDto request);

    Task<Content?> GetByIdAsync(int id);

    Task<Content?> GetByIdTrackedAsync(int id);

    Task<(
        int TotalCount,
        int PublishedCount,
        int DraftCount,
        int SoftDeletedCount,
        List<Content> RecentContents
    )> GetDashboardSummaryAsync();

    Task<List<int>> GetValidRelatedContentIdsAsync(IEnumerable<int> ids);

    Task<List<Content>> GetRelatedContentOptionsAsync(int? excludeId);

    // Public content
    Task<(List<Content> Items, int TotalCount)> GetAllPublicAsync(
        PublicContentQueryRequestDto request);

    Task<(
        Content? LatestContent,
        int TotalCount,
        int ExperienceCount,
        int LearningCount,
        int LifestyleCount
    )> GetPublicSummaryAsync();

    Task<Content?> GetPublishedByIdAsync(int id);
}
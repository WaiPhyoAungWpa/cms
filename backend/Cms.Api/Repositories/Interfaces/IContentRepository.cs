using Cms.Api.Entities;
using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.PublicContent;

namespace Cms.Api.Repositories.Interfaces;

public interface IContentRepository
{
    Task AddAsync(Content content);

    Task SaveChangesAsync();

    Task<(List<Content> Items, int TotalCount)> GetAllAsync(
        ContentQueryRequestDto request);

    Task<(List<Content> Items, int TotalCount)> GetAllPublicAsync(
        PublicContentQueryRequestDto request);

    Task<(
        Content? LatestContent,
        int TotalCount,
        int ExperienceCount,
        int LearningCount,
        int LifestyleCount
    )> GetPublicSummaryAsync();

    Task<Content?> GetByIdAsync(int id);

    Task<Content?> GetByIdForUpdateAsync(int id);

    Task<Content?> GetByIdForDeleteAsync(int id);

    Task<Content?> GetByIdForRestoreAsync(int id);

    Task<(
        int TotalCount,
        int PublishedCount,
        int DraftCount,
        int SoftDeletedCount,
        List<Content> RecentContents
    )> GetDashboardSummaryAsync();

    Task<Content?> GetPublishedByIdAsync(int id);
}
using Cms.Api.Data.Context;
using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.PublicContent;
using Cms.Api.DTOs.RelatedContent;
using Cms.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cms.Api.Repositories;

public class ContentRepository : IContentRepository
{
    private const int DashboardRecentContentLimit = 5;
    
    private readonly CmsDbContext _context;

    public ContentRepository(CmsDbContext context)
    {
        _context = context;
    }

    // Persistence
    public async Task AddAsync(Content content)
    {
        await _context.Contents.AddAsync(content);
    }
    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    // Admin content
    public async Task<(List<Content> Items, int TotalCount)> GetAllAsync(
        ContentQueryRequestDto request)
    {
        IQueryable<Content> query = _context.Contents
            .AsNoTracking()
            .Include(c => c.Category);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(c =>
                EF.Functions.ILike(c.Title, $"%{request.Search}%") ||
                EF.Functions.ILike(c.Description, $"%{request.Search}%"));
        }

        if (request.CategoryId.HasValue)
        {
            query = query.Where(c =>
                c.CategoryId == request.CategoryId.Value);
        }

        if (request.Status.HasValue)
        {
            query = query.Where(c =>
                c.Status == request.Status.Value);
        }

        if (request.VisibilityStatus.HasValue)
        {
            query = query.Where(c =>
                c.VisibilityStatus == request.VisibilityStatus.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Content?> GetByIdAsync(int id)
    {
        return await _context.Contents
            .AsNoTracking()
            .Include(c => c.Category)
            .Include(c => c.CoverImage)
            .Include(c => c.RelatedContents)
                .ThenInclude(r => r.RelatedContent)
                    .ThenInclude(c => c.Category)
            .Include(c => c.RelatedContents)
                .ThenInclude(r => r.RelatedContent)
                    .ThenInclude(c => c.CoverImage)
            .Include(c => c.Sections.OrderBy(s => s.Id))
                .ThenInclude(s => s.SectionImage)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Content?> GetByIdTrackedAsync(int id)
    {
        return await _context.Contents
            .Include(c => c.CoverImage)
            .Include(c => c.Sections)
                .ThenInclude(s => s.SectionImage)
            .Include(c => c.RelatedContents)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<(
        int TotalCount,
        int PublishedCount,
        int DraftCount,
        int SoftDeletedCount,
        List<Content> RecentContents
    )> GetDashboardSummaryAsync()
    {
        var query = _context.Contents.AsNoTracking();

        var counts = await query
            .GroupBy(_ => 1)
            .Select(group => new
            {
                TotalCount = group.Count(),
                PublishedCount = group.Count(c => c.Status == ContentStatus.Published),
                DraftCount = group.Count(c => c.Status == ContentStatus.Draft),
                SoftDeletedCount = group.Count(c => c.Status == ContentStatus.SoftDeleted)
            })
            .FirstOrDefaultAsync();

        var recentContents = await query
            .Include(c => c.Category)
            .OrderByDescending(c => c.UpdatedAt)
            .Take(DashboardRecentContentLimit)
            .ToListAsync();

        return (
            counts?.TotalCount ?? 0,
            counts?.PublishedCount ?? 0,
            counts?.DraftCount ?? 0,
            counts?.SoftDeletedCount ?? 0,
            recentContents
        );
    }

    public async Task<List<int>> GetValidRelatedContentIdsAsync(
        IEnumerable<int> ids)
    {
        return await _context.Contents
            .Where(c =>
                ids.Contains(c.Id) &&
                c.Status == ContentStatus.Published &&
                c.VisibilityStatus == VisibilityStatus.Public)
            .Select(c => c.Id)
            .ToListAsync();
    }

    public async Task<(List<Content> Items, int TotalCount)>
        GetRelatedContentOptionsAsync(
            RelatedContentQueryRequestDto request)
    {
        IQueryable<Content> query = _context.Contents
            .AsNoTracking()
            .Include(c => c.Category)
            .Include(c => c.CoverImage)
            .Where(c =>
                c.Status == ContentStatus.Published &&
                c.VisibilityStatus == VisibilityStatus.Public);

        if (request.ExcludeId.HasValue)
        {
            query = query.Where(c =>
                c.Id != request.ExcludeId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(c =>
                EF.Functions.ILike(
                    c.Title,
                    $"%{request.Search}%") ||
                EF.Functions.ILike(
                    c.Description,
                    $"%{request.Search}%"));
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(c => c.Title)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    // Public content
    public async Task<(List<Content> Items, int TotalCount)> GetAllPublicAsync(
        PublicContentQueryRequestDto request)
    {
        var query = _context.Contents
            .AsNoTracking()
            .Include(c => c.Category)
            .Include(c => c.CoverImage)
            .Where(c =>
                c.Status == ContentStatus.Published &&
                c.VisibilityStatus == VisibilityStatus.Public);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(c =>
                EF.Functions.ILike(c.Title, $"%{request.Search}%") ||
                EF.Functions.ILike(c.Description, $"%{request.Search}%"));
        }

        if (request.CategoryId.HasValue)
        {
            query = query.Where(c =>
                c.CategoryId == request.CategoryId.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<(
        Content? LatestContent,
        int TotalCount,
        int ExperienceCount,
        int LearningCount,
        int LifestyleCount
    )> GetPublicSummaryAsync()
    {
        var query = _context.Contents
            .AsNoTracking()
            .Where(c =>
                c.Status == ContentStatus.Published &&
                c.VisibilityStatus == VisibilityStatus.Public);

        var counts = await query
            .GroupBy(_ => 1)
            .Select(group => new
            {
                TotalCount = group.Count(),
                ExperienceCount = group.Count(c => c.Category.Name == "Experience"),
                LearningCount = group.Count(c => c.Category.Name == "Learning"),
                LifestyleCount = group.Count(c => c.Category.Name == "Lifestyle")
            })
            .FirstOrDefaultAsync();

        var latestContent = await query
            .Include(c => c.Category)
            .Include(c => c.CoverImage)
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync();

        return (
            latestContent,
            counts?.TotalCount ?? 0,
            counts?.ExperienceCount ?? 0,
            counts?.LearningCount ?? 0,
            counts?.LifestyleCount ?? 0
        );
    }

    public async Task<Content?> GetPublishedByIdAsync(int id)
    {
        return await _context.Contents
            .AsNoTracking()
            .Include(c => c.Category)
            .Include(c => c.CoverImage)
            .Include(c => c.RelatedContents)
                .ThenInclude(r => r.RelatedContent)
                    .ThenInclude(c => c.Category)
            .Include(c => c.RelatedContents)
                .ThenInclude(r => r.RelatedContent)
                    .ThenInclude(c => c.CoverImage)
            .Include(c => c.Sections.OrderBy(s => s.Id))
                .ThenInclude(s => s.SectionImage)
            .FirstOrDefaultAsync(c =>
                c.Id == id &&
                c.Status == ContentStatus.Published &&
                c.VisibilityStatus == VisibilityStatus.Public);
    }
}
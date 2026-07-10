using Cms.Api.Data.Context;
using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.PublicContent;
using Cms.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cms.Api.Repositories;

public class ContentRepository : IContentRepository
{
    private readonly CmsDbContext _context;

    public ContentRepository(CmsDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Content content)
    {
        await _context.Contents.AddAsync(content);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<(List<Content> Items, int TotalCount)> GetAllAsync(
        ContentQueryRequestDto request)
    {
        var query = _context.Contents
            .Include(c => c.Category)
            .AsQueryable();

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

        var totalCount = await query.CountAsync();

        var experienceCount = await query
            .CountAsync(c => c.Category.Name == "Experience");

        var learningCount = await query
            .CountAsync(c => c.Category.Name == "Learning");

        var lifestyleCount = await query
            .CountAsync(c => c.Category.Name == "Lifestyle");

        var latestContent = await query
            .Include(c => c.Category)
            .Include(c => c.CoverImage)
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync();

        return (
            latestContent,
            totalCount,
            experienceCount,
            learningCount,
            lifestyleCount
        );
    }

    public async Task<Content?> GetByIdAsync(int id)
    {
        return await _context.Contents
            .AsNoTracking()
            .Include(c => c.Category)
            .Include(c => c.CoverImage)
            .Include(c => c.Sections.OrderBy(s => s.Id))
                .ThenInclude(s => s.SectionImage)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Content?> GetByIdForUpdateAsync(int id)
    {
        return await _context.Contents
            .Include(c => c.Sections)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Content?> GetByIdForDeleteAsync(int id)
    {
        return await _context.Contents
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Content?> GetByIdForRestoreAsync(int id)
    {
        return await _context.Contents
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
        var totalCount = await _context.Contents.CountAsync();

        var publishedCount = await _context.Contents
            .CountAsync(c => c.Status == ContentStatus.Published);

        var draftCount = await _context.Contents
            .CountAsync(c => c.Status == ContentStatus.Draft);

        var softDeletedCount = await _context.Contents
            .CountAsync(c => c.Status == ContentStatus.SoftDeleted);

        var recentContents = await _context.Contents
            .AsNoTracking()
            .Include(c => c.Category)
            .OrderByDescending(c => c.UpdatedAt)
            .Take(5)
            .ToListAsync();

        return (
            totalCount,
            publishedCount,
            draftCount,
            softDeletedCount,
            recentContents
        );
    }

    public async Task<Content?> GetPublishedByIdAsync(int id)
    {
        return await _context.Contents
            .AsNoTracking()
            .Include(c => c.Category)
            .Include(c => c.CoverImage)
            .Include(c => c.Sections.OrderBy(s => s.Id))
                .ThenInclude(s => s.SectionImage)
            .FirstOrDefaultAsync(c =>
                c.Id == id &&
                c.Status == ContentStatus.Published &&
                c.VisibilityStatus == VisibilityStatus.Public);
    }

}
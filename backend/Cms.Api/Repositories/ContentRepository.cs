using Cms.Api.Data.Context;
using Cms.Api.Entities;
using Cms.Api.DTOs.Content;
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

}
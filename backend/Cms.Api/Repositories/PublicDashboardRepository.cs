using Cms.Api.Data.Context;
using Cms.Api.Entities.Enums;
using Cms.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cms.Api.Repositories;

public class PublicDashboardRepository : IPublicDashboardRepository
{
    private readonly CmsDbContext _context;

    public PublicDashboardRepository(CmsDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetPublishedContentCountAsync()
    {
        return await _context.Contents.CountAsync(content =>
            content.Status == ContentStatus.Published &&
            content.VisibilityStatus == VisibilityStatus.Public);
    }

    public async Task<int> GetCategoryCountAsync()
    {
        return await _context.Categories.CountAsync();
    }
}
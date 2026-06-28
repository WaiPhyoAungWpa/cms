using Cms.Api.Data.Context;
using Cms.Api.Entities;
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
}
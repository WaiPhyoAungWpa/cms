using Cms.Api.Data.Context;
using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cms.Api.Repositories;

public class ImageRepository : IImageRepository
{
    private readonly CmsDbContext _context;

    public ImageRepository(CmsDbContext context)
    {
        _context = context;
    }

    public async Task<List<Image>> GetDefaultImagesByCategoryAsync(int categoryId)
    {
        return await _context.Images
            .Where(image =>
                image.CategoryId == categoryId &&
                image.Type == ImageType.Default)
            .OrderBy(image => image.Id)
            .ToListAsync();
    }

    public async Task AddAsync(Image image)
    {
        await _context.Images.AddAsync(image);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
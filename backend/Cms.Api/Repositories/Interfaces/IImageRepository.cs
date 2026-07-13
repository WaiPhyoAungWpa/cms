using Cms.Api.Entities;

namespace Cms.Api.Repositories.Interfaces;

public interface IImageRepository
{
    // Persistence
    Task AddAsync(Image image);
    Task SaveChangesAsync();

    // Default images
    Task<List<Image>> GetDefaultImagesByCategoryAsync(int categoryId);

    Task<List<Image>> GetByIdsAsync(IEnumerable<int> imageIds);
}
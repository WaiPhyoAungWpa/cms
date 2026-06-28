using Cms.Api.Entities;

namespace Cms.Api.Repositories.Interfaces;

public interface IImageRepository
{
    Task<List<Image>> GetDefaultImagesByCategoryAsync(int categoryId);

    Task AddAsync(Image image);

    Task SaveChangesAsync();
}
using Cms.Api.Entities;

namespace Cms.Api.Repositories;

public interface IContentRepository
{
    Task AddAsync(Content content);

    Task SaveChangesAsync();
}
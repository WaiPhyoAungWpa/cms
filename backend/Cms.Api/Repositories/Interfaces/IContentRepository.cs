using Cms.Api.Entities;

namespace Cms.Api.Repositories.Interfaces;

public interface IContentRepository
{
    Task AddAsync(Content content);

    Task SaveChangesAsync();
}
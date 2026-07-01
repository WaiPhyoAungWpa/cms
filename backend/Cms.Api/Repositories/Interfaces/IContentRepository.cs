using Cms.Api.Entities;
using Cms.Api.DTOs.Content;

namespace Cms.Api.Repositories.Interfaces;

public interface IContentRepository
{
    Task AddAsync(Content content);

    Task SaveChangesAsync();

    Task<(List<Content> Items, int TotalCount)> GetAllAsync(
        ContentQueryRequestDto request);

}
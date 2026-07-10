using Cms.Api.Entities;

namespace Cms.Api.Repositories.Interfaces;

public interface IAdminRepository
{
    Task<Admin?> GetByUsernameAsync(string username);

    Task SaveChangesAsync();
}
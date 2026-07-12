using Cms.Api.Entities;

namespace Cms.Api.Repositories.Interfaces;

public interface IAdminRepository
{
    // Persistence
    Task SaveChangesAsync();

    // Authentication
    Task<Admin?> GetByUsernameAsync(string username);
}
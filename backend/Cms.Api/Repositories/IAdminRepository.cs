using Cms.Api.Entities;

namespace Cms.Api.Repositories;

public interface IAdminRepository
{
    Task<Admin?> GetByUsernameAsync(string username);
}
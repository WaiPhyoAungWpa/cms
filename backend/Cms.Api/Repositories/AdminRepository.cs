using Cms.Api.Data.Context;
using Cms.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cms.Api.Repositories;

public class AdminRepository : IAdminRepository
{
    private readonly CmsDbContext _context;

    public AdminRepository(CmsDbContext context)
    {
        _context = context;
    }

    public async Task<Admin?> GetByUsernameAsync(string username)
    {
        return await _context.Admins
            .FirstOrDefaultAsync(a => a.Username == username);
    }
}
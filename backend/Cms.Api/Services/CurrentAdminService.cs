using System.Security.Claims;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Cms.Api.Services;

public class CurrentAdminService : ICurrentAdminService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentAdminService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int GetAdminId()
    {
        var user = _httpContextAccessor.HttpContext?.User;

        if (user?.Identity?.IsAuthenticated != true)
        {
            throw new UnauthorizedAccessException("Admin is not authenticated.");
        }

        var adminId = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(adminId, out var id))
        {
            throw new UnauthorizedAccessException("Invalid administrator identifier.");
        }

        return id;
    }
}
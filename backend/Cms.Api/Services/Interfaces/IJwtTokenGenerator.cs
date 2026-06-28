using Cms.Api.Entities;

namespace Cms.Api.Services.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(Admin admin);
}
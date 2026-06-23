using Cms.Api.Entities;

namespace Cms.Api.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(Admin admin);
}
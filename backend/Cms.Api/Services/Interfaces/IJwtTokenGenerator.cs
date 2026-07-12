using Cms.Api.Entities;

namespace Cms.Api.Services.Interfaces;

/// <summary>
/// Generates JWT access tokens for administrators.
/// </summary>
public interface IJwtTokenGenerator
{
    /// <summary>
    /// Generates a JWT for the specified administrator.
    /// </summary>
    string GenerateToken(Admin admin);
}
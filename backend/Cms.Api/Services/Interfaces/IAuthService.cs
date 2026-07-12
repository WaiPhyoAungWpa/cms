using Cms.Api.DTOs.Auth;

namespace Cms.Api.Services.Interfaces;

/// <summary>
/// Defines administrator authentication operations.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Authenticates an administrator.
    /// </summary>
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}
using Cms.Api.DTOs.Auth;
using Cms.Api.Services.Interfaces;

namespace Cms.Api.Tests.Integration.Infrastructure;

/// <summary>
/// Provides predictable failed login results without using the real database.
/// </summary>
public sealed class TestAuthService : IAuthService
{
    public Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        return Task.FromResult<LoginResponseDto?>(null);
    }
}
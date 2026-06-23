using Cms.Api.DTOs.Auth;

namespace Cms.Api.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}
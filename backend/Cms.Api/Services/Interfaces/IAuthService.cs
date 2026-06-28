using Cms.Api.DTOs.Auth;

namespace Cms.Api.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}
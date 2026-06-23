using Cms.Api.DTOs.Auth;
using Cms.Api.Repositories;
using Cms.Api.Interfaces;

namespace Cms.Api.Services;

public class AuthService : IAuthService
{
    private readonly IAdminRepository _adminRepository;

    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(IAdminRepository adminRepository, IJwtTokenGenerator jwtTokenGenerator)
    {
        _adminRepository = adminRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var admin =
            await _adminRepository.GetByUsernameAsync(request.Username);

        if (admin == null)
            return null;

        if (admin.PasswordHash != request.Password)
            return null;

        return new LoginResponseDto
        {
            Token = _jwtTokenGenerator.GenerateToken(admin)
        };
    }
}
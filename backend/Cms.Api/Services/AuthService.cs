using Cms.Api.DTOs.Auth;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services.Interfaces;
using Cms.Api.Entities;
using Microsoft.AspNetCore.Identity;

namespace Cms.Api.Services;

public class AuthService : IAuthService
{
    private readonly IAdminRepository _adminRepository;
    private readonly IPasswordHasher<Admin> _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IAdminRepository adminRepository,
        IPasswordHasher<Admin> passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _adminRepository = adminRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var admin =
            await _adminRepository.GetByUsernameAsync(request.Username);

        if (admin == null)
            return null;

        var verificationResult = _passwordHasher.VerifyHashedPassword(
            admin,
            admin.PasswordHash,
            request.Password);

        if (verificationResult == PasswordVerificationResult.Failed)
            return null;

        if (verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
        {
            admin.PasswordHash = _passwordHasher.HashPassword(
                admin,
                request.Password);

            await _adminRepository.SaveChangesAsync();
        }

        return new LoginResponseDto
        {
            Token = _jwtTokenGenerator.GenerateToken(admin)
        };
    }
}
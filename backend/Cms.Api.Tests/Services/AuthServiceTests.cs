using Cms.Api.DTOs.Auth;
using Cms.Api.Entities;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace Cms.Api.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IAdminRepository> _adminRepositoryMock;
    private readonly Mock<IPasswordHasher<Admin>> _passwordHasherMock;
    private readonly Mock<IJwtTokenGenerator> _jwtTokenGeneratorMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _adminRepositoryMock = new Mock<IAdminRepository>();
        _passwordHasherMock = new Mock<IPasswordHasher<Admin>>();
        _jwtTokenGeneratorMock = new Mock<IJwtTokenGenerator>();

        _authService = new AuthService(
            _adminRepositoryMock.Object,
            _passwordHasherMock.Object,
            _jwtTokenGeneratorMock.Object);
    }

    [Fact]
    public async Task LoginAsync_ReturnsNull_WhenAdminDoesNotExist()
    {
        // Arrange
        var request = new LoginRequestDto
        {
            Username = "admin",
            Password = "password"
        };

        _adminRepositoryMock
            .Setup(repository => repository.GetByUsernameAsync(request.Username))
            .ReturnsAsync((Admin?)null);

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Null(result);

        _passwordHasherMock.Verify(
            hasher => hasher.VerifyHashedPassword(
                It.IsAny<Admin>(),
                It.IsAny<string>(),
                It.IsAny<string>()),
            Times.Never);

        _jwtTokenGeneratorMock.Verify(
            generator => generator.GenerateToken(It.IsAny<Admin>()),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_ReturnsNull_WhenPasswordIsIncorrect()
    {
        // Arrange
        var admin = new Admin
        {
            Id = 1,
            Username = "admin",
            PasswordHash = "hashed-password"
        };

        var request = new LoginRequestDto
        {
            Username = "admin",
            Password = "wrong-password"
        };

        _adminRepositoryMock
            .Setup(repository => repository.GetByUsernameAsync(request.Username))
            .ReturnsAsync(admin);

        _passwordHasherMock
            .Setup(hasher => hasher.VerifyHashedPassword(
                admin,
                admin.PasswordHash,
                request.Password))
            .Returns(PasswordVerificationResult.Failed);

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Null(result);

        _jwtTokenGeneratorMock.Verify(
            generator => generator.GenerateToken(It.IsAny<Admin>()),
            Times.Never);

        _adminRepositoryMock.Verify(
            repository => repository.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_ReturnsToken_WhenCredentialsAreValid()
    {
        // Arrange
        var admin = new Admin
        {
            Id = 1,
            Username = "admin",
            PasswordHash = "hashed-password"
        };

        var request = new LoginRequestDto
        {
            Username = "admin",
            Password = "password"
        };

        const string token = "jwt-token";

        _adminRepositoryMock
            .Setup(repository => repository.GetByUsernameAsync(request.Username))
            .ReturnsAsync(admin);

        _passwordHasherMock
            .Setup(hasher => hasher.VerifyHashedPassword(
                admin,
                admin.PasswordHash,
                request.Password))
            .Returns(PasswordVerificationResult.Success);

        _jwtTokenGeneratorMock
            .Setup(generator => generator.GenerateToken(admin))
            .Returns(token);

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(token, result.Token);

        _jwtTokenGeneratorMock.Verify(
            generator => generator.GenerateToken(admin),
            Times.Once);

        _adminRepositoryMock.Verify(
            repository => repository.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_RehashesPassword_WhenRehashIsRequired()
    {
        // Arrange
        var admin = new Admin
        {
            Id = 1,
            Username = "admin",
            PasswordHash = "old-hash"
        };

        var request = new LoginRequestDto
        {
            Username = "admin",
            Password = "password"
        };

        const string newHash = "new-hash";
        const string token = "jwt-token";

        _adminRepositoryMock
            .Setup(repository => repository.GetByUsernameAsync(request.Username))
            .ReturnsAsync(admin);

        _passwordHasherMock
            .Setup(hasher => hasher.VerifyHashedPassword(
                admin,
                admin.PasswordHash,
                request.Password))
            .Returns(PasswordVerificationResult.SuccessRehashNeeded);

        _passwordHasherMock
            .Setup(hasher => hasher.HashPassword(admin, request.Password))
            .Returns(newHash);

        _jwtTokenGeneratorMock
            .Setup(generator => generator.GenerateToken(admin))
            .Returns(token);

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(token, result.Token);
        Assert.Equal(newHash, admin.PasswordHash);

        _passwordHasherMock.Verify(
            hasher => hasher.HashPassword(admin, request.Password),
            Times.Once);

        _adminRepositoryMock.Verify(
            repository => repository.SaveChangesAsync(),
            Times.Once);

        _jwtTokenGeneratorMock.Verify(
            generator => generator.GenerateToken(admin),
            Times.Once);
    }
}
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Cms.Api.Configurations;
using Cms.Api.Entities;
using Cms.Api.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Cms.Api.Tests.Services;

public class JwtTokenGeneratorTests
{
    private readonly JwtSettings _settings;
    private readonly JwtTokenGenerator _generator;
    private readonly Admin _admin;

    public JwtTokenGeneratorTests()
    {
        _settings = new JwtSettings
        {
            Key = "ThisIsASuperSecretKeyWithAtLeast32Bytes!",
            Issuer = "Cms.Api",
            Audience = "Cms.Client",
            TokenLifetimeHours = 2
        };

        _generator = new JwtTokenGenerator(Options.Create(_settings));

        _admin = new Admin
        {
            Id = 1,
            Username = "admin"
        };
    }

    [Fact]
    public void GenerateToken_ReturnsValidJwtToken()
    {
        // Act
        var token = _generator.GenerateToken(_admin);

        // Assert
        Assert.False(string.IsNullOrWhiteSpace(token));

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.NotNull(jwt);
    }

    [Fact]
    public void GenerateToken_ContainsAdminClaims()
    {
        // Act
        var token = _generator.GenerateToken(_admin);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        // Assert
        Assert.Equal(
            _admin.Id.ToString(),
            jwt.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

        Assert.Equal(
            _admin.Username,
            jwt.Claims.First(c => c.Type == ClaimTypes.Name).Value);
    }

    [Fact]
    public void GenerateToken_UsesConfiguredIssuer()
    {
        // Act
        var token = _generator.GenerateToken(_admin);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        // Assert
        Assert.Equal(_settings.Issuer, jwt.Issuer);
    }

    [Fact]
    public void GenerateToken_UsesConfiguredAudience()
    {
        // Act
        var token = _generator.GenerateToken(_admin);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        // Assert
        Assert.Single(jwt.Audiences);
        Assert.Equal(_settings.Audience, jwt.Audiences.Single());
    }

    [Fact]
    public void GenerateToken_UsesConfiguredLifetime()
    {
        // Arrange
        var before = DateTime.UtcNow;

        // Act
        var token = _generator.GenerateToken(_admin);

        var after = DateTime.UtcNow;

        var jwt = new JwtSecurityTokenHandler()
            .ReadJwtToken(token);

        // Assert
        var expectedBefore = before
            .AddHours(_settings.TokenLifetimeHours)
            .AddSeconds(-1);

        var expectedAfter = after
            .AddHours(_settings.TokenLifetimeHours)
            .AddSeconds(1);

        Assert.InRange(jwt.ValidTo, expectedBefore, expectedAfter);
    }

    [Fact]
    public void GenerateToken_UsesHs256SigningAlgorithm()
    {
        // Act
        var token = _generator.GenerateToken(_admin);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        // Assert
        Assert.Equal(SecurityAlgorithms.HmacSha256, jwt.Header.Alg);
    }
}
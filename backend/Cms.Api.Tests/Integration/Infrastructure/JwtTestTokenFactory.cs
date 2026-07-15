using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Cms.Api.Tests.Integration.Infrastructure;

/// <summary>
/// Creates valid JWTs for authenticated integration-test requests.
/// </summary>
internal static class JwtTestTokenFactory
{
    public static string CreateValidToken()
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                "ThisIsAnIntegrationTestKeyWithAtLeast32Bytes!"));

        var token = new JwtSecurityToken(
            issuer: "Cms.Api.Tests",
            audience: "Cms.Api.Tests.Client",
            claims:
            [
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Name, "admin")
            ],
            expires: DateTime.UtcNow.AddMinutes(5),
            signingCredentials: new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}
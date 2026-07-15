using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Headers;
using Cms.Api.Tests.Integration.Infrastructure;

namespace Cms.Api.Tests.Integration;

/// <summary>
/// Verifies that protected API endpoints reject missing JWTs and accept valid ones.
/// </summary>
public sealed class AuthorizationIntegrationTests
    : IClassFixture<CmsApiFactory>
{
    private readonly HttpClient _client;

    public AuthorizationIntegrationTests(CmsApiFactory factory)
    {
        _client = factory.CreateClient(
            new WebApplicationFactoryClientOptions
            {
                BaseAddress = new Uri("https://localhost"),
                AllowAutoRedirect = false
            });
    }

    [Fact]
    public async Task GetContent_ReturnsUnauthorized_WhenJwtIsMissing()
    {
        var response = await _client.GetAsync("/api/content");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetProfile_ReturnsOk_WhenJwtIsValid()
    {
        var token = JwtTestTokenFactory.CreateValidToken();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync("/api/auth/profile");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
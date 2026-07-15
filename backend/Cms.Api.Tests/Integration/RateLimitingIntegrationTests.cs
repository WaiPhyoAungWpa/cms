using System.Net;
using System.Net.Http.Json;
using Cms.Api.DTOs.Auth;
using Microsoft.AspNetCore.Mvc.Testing;
using Cms.Api.Tests.Integration.Infrastructure;

namespace Cms.Api.Tests.Integration;

/// <summary>
/// Verifies per-IP request limits for login and image-upload endpoints.
/// </summary>
public sealed class RateLimitingIntegrationTests
    : IClassFixture<CmsApiFactory>
{
    private readonly HttpClient _client;

    public RateLimitingIntegrationTests(CmsApiFactory factory)
    {
        _client = factory.CreateClient(
            new WebApplicationFactoryClientOptions
            {
                BaseAddress = new Uri("https://localhost"),
                AllowAutoRedirect = false
            });
    }

    [Fact]
    public async Task Login_ReturnsTooManyRequests_AfterFiveAttempts()
    {
        var request = new LoginRequestDto
        {
            Username = "admin",
            Password = "wrong-password"
        };

        for (var attempt = 1; attempt <= 5; attempt++)
        {
            var response = await _client.PostAsJsonAsync(
                "/api/auth/login",
                request);

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        var limitedResponse = await _client.PostAsJsonAsync(
            "/api/auth/login",
            request);

        Assert.Equal(
            HttpStatusCode.TooManyRequests,
            limitedResponse.StatusCode);
    }

    [Fact]
    public async Task Upload_ReturnsTooManyRequests_AfterTenAttempts()
    {
        for (var attempt = 1; attempt <= 10; attempt++)
        {
            using var request = new MultipartFormDataContent();

            var response = await _client.PostAsync(
                "/api/images/upload",
                request);

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        using var limitedRequest = new MultipartFormDataContent();

        var limitedResponse = await _client.PostAsync(
            "/api/images/upload",
            limitedRequest);

        Assert.Equal(
            HttpStatusCode.TooManyRequests,
            limitedResponse.StatusCode);
    }
}
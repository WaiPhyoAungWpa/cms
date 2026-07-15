using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Cms.Api.Tests.Integration.Infrastructure;

namespace Cms.Api.Tests.Integration;

/// <summary>
/// Verifies standardized API responses for expected and unexpected exceptions.
/// </summary>
public sealed class GlobalExceptionHandlingIntegrationTests
    : IClassFixture<CmsApiFactory>
{
    private readonly HttpClient _client;

    public GlobalExceptionHandlingIntegrationTests(CmsApiFactory factory)
    {
        _client = factory.CreateClient(
            new WebApplicationFactoryClientOptions
            {
                BaseAddress = new Uri("https://localhost"),
                AllowAutoRedirect = false
            });
    }

    [Fact]
    public async Task GetPublicContent_ReturnsNotFound_ForMissingContent()
    {
        var response = await _client.GetAsync("/api/public/content/404");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var body = await response.Content.ReadAsStringAsync();

        Assert.Contains("Content not found.", body);
    }

    [Fact]
    public async Task GetPublicContent_ReturnsSafeServerError_ForUnexpectedException()
    {
        var response = await _client.GetAsync("/api/public/content/500");

        Assert.Equal(
            HttpStatusCode.InternalServerError,
            response.StatusCode);

        var body = await response.Content.ReadAsStringAsync();

        Assert.Contains("An unexpected error occurred.", body);
        Assert.DoesNotContain("Test exception.", body);
    }
}
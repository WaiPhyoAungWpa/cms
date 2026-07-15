using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using Cms.Api.Tests.Integration.Infrastructure;

namespace Cms.Api.Tests.Integration;

/// <summary>
/// Verifies that multipart requests exceeding the configured size limit are rejected.
/// </summary>
public sealed class MultipartUploadIntegrationTests
    : IClassFixture<CmsApiFactory>
{
    private readonly HttpClient _client;

    public MultipartUploadIntegrationTests(CmsApiFactory factory)
    {
        _client = factory.CreateClient(
            new WebApplicationFactoryClientOptions
            {
                BaseAddress = new Uri("https://localhost"),
                AllowAutoRedirect = false
            });

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                JwtTestTokenFactory.CreateValidToken());
    }

    [Fact]
    public async Task Upload_ReturnsBadRequest_WhenMultipartBodyExceedsLimit()
    {
        var bytes = new byte[6 * 1024 * 1024];

        using var imageContent = new ByteArrayContent(bytes);
        imageContent.Headers.ContentType =
            new MediaTypeHeaderValue("image/jpeg");

        using var form = new MultipartFormDataContent();
        form.Add(imageContent, "file", "large.jpg");
        form.Add(new StringContent("1"), "categoryId");

        var response = await _client.PostAsync(
            "/api/images/upload",
            form);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
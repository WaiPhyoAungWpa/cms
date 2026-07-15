using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Cms.Api.Tests.Integration.Infrastructure;

/// <summary>
/// Creates an in-memory API host with isolated testing configuration and services.
/// </summary>
public sealed class CmsApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, configurationBuilder) =>
        {
            configurationBuilder.AddInMemoryCollection(
                new Dictionary<string, string?>
                {
                    ["ConnectionStrings:DefaultConnection"] =
                        "Host=localhost;Database=cms_test;Username=test;Password=test",

                    ["Jwt:Key"] =
                        "ThisIsAnIntegrationTestKeyWithAtLeast32Bytes!",
                    ["Jwt:Issuer"] = "Cms.Api.Tests",
                    ["Jwt:Audience"] = "Cms.Api.Tests.Client",
                    ["Jwt:TokenLifetimeHours"] = "1",

                    ["Cloudinary:CloudName"] = "test-cloud",
                    ["Cloudinary:ApiKey"] = "test-key",
                    ["Cloudinary:ApiSecret"] = "test-secret",

                    ["ImageUpload:MaxFileSize"] = "5242880",
                    ["ImageUpload:AllowedExtensions:0"] = ".jpg",
                    ["ImageUpload:AllowedExtensions:1"] = ".jpeg",
                    ["ImageUpload:AllowedExtensions:2"] = ".png",
                    ["ImageUpload:AllowedExtensions:3"] = ".webp",
                    ["ImageUpload:AllowedContentTypes:0"] = "image/jpeg",
                    ["ImageUpload:AllowedContentTypes:1"] = "image/png",
                    ["ImageUpload:AllowedContentTypes:2"] = "image/webp"
                });
        });

        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<IAuthService>();
            services.AddScoped<IAuthService, TestAuthService>();
            services.RemoveAll<IPublicContentService>();
            services.AddScoped<IPublicContentService, TestPublicContentService>();
        });
    }
}
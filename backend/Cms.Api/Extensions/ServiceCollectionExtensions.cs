using System.Text;
using Cms.Api.Configurations;
using Cms.Api.Data;
using Cms.Api.Data.Context;
using Cms.Api.Entities;
using Cms.Api.Repositories;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

namespace Cms.Api.Extensions;

/// <summary>
/// Provides extension methods for registering application services
/// and Swagger documentation.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers the application's services, repositories,
    /// authentication, authorization, and configuration.
    /// </summary>
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "ConnectionStrings:DefaultConnection is required.");

        services.AddDbContext<CmsDbContext>(options =>
            options.UseNpgsql(connectionString));

        // Configuration
        services.AddOptions<CloudinarySettings>()
            .Bind(configuration.GetRequiredSection(CloudinarySettings.SectionName))
            .Validate(
                settings => !string.IsNullOrWhiteSpace(settings.CloudName),
                "Cloudinary:CloudName is required.")
            .Validate(
                settings => !string.IsNullOrWhiteSpace(settings.ApiKey),
                "Cloudinary:ApiKey is required.")
            .Validate(
                settings => !string.IsNullOrWhiteSpace(settings.ApiSecret),
                "Cloudinary:ApiSecret is required.")
            .ValidateOnStart();

        services.Configure<InitialAdminSettings>(
            configuration.GetSection(InitialAdminSettings.SectionName));

        services.AddOptions<ImageUploadSettings>()
            .Bind(configuration.GetRequiredSection(ImageUploadSettings.SectionName))
            .Validate(
                settings => settings.MaxFileSize > 0,
                "ImageUpload:MaxFileSize must be greater than zero.")
            .Validate(
                settings => settings.AllowedExtensions.Length > 0 &&
                            settings.AllowedExtensions.All(
                                extension => !string.IsNullOrWhiteSpace(extension) &&
                                            extension.StartsWith('.')),
                "ImageUpload:AllowedExtensions must contain file extensions.")
            .Validate(
                settings => settings.AllowedContentTypes.Length > 0 &&
                            settings.AllowedContentTypes.All(
                                contentType => !string.IsNullOrWhiteSpace(contentType)),
                "ImageUpload:AllowedContentTypes must contain MIME types.")
            .ValidateOnStart();

        services.AddOptions<JwtSettings>()
            .Bind(configuration.GetRequiredSection(JwtSettings.SectionName))
            .Validate(
                settings => !string.IsNullOrWhiteSpace(settings.Key) &&
                            settings.Key.Trim() != "...",
                "Jwt:Key is required and cannot be a placeholder.")
            .Validate(
                settings => Encoding.UTF8.GetByteCount(settings.Key) >= 32,
                "Jwt:Key must be at least 32 bytes for HS256.")
            .Validate(
                settings => !string.IsNullOrWhiteSpace(settings.Issuer),
                "Jwt:Issuer is required.")
            .Validate(
                settings => !string.IsNullOrWhiteSpace(settings.Audience),
                "Jwt:Audience is required.")
            .Validate(
                settings => settings.TokenLifetimeHours is > 0 and <= 24,
                "Jwt:TokenLifetimeHours must be between 1 and 24.")
            .ValidateOnStart();

        services.AddOptions<GoogleAnalyticsSettings>()
            .Bind(configuration.GetSection(GoogleAnalyticsSettings.SectionName))
            .Validate(
                settings => !string.IsNullOrWhiteSpace(settings.PropertyId),
                "GoogleAnalytics:PropertyId is required.")
            .ValidateOnStart();

        // Infrastructure
        services.AddHttpContextAccessor();
        services.AddScoped<IPasswordHasher<Admin>, PasswordHasher<Admin>>();
        services.AddScoped<AdminDatabaseInitializer>();

        // Repositories
        services.AddScoped<IAdminRepository, AdminRepository>();
        services.AddScoped<IContentRepository, ContentRepository>();
        services.AddScoped<IImageRepository, ImageRepository>();
        services.AddScoped<IPublicDashboardRepository, PublicDashboardRepository>();

        // Services
        services.AddScoped<ICurrentAdminService, CurrentAdminService>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IImageStorageService, CloudinaryImageStorageService>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IContentService, ContentService>();
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IPublicContentService, PublicContentService>();

        services.AddScoped<IGoogleAnalyticsService, GoogleAnalyticsService>();
        services.AddScoped<IPublicDashboardService, PublicDashboardService>();

        // Authentication & Authorization
        var jwtKey = configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key is required.");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey))
                };
            });

        services.AddAuthorization();

        return services;
    }

    /// <summary>
    /// Registers Swagger/OpenAPI documentation and JWT authentication support.
    /// </summary>
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "CMS API",
                Version = "v1"
            });

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header
            });

            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecuritySchemeReference("Bearer", document, null),
                    []
                }
            });
        });

        return services;
    }
}
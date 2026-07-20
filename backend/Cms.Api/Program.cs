using Cms.Api.Extensions;
using DotNetEnv;
using System.Text.Json.Serialization;
using Cms.Api.Data;
using Cms.Api.Exceptions;
using Cms.Api.Configurations;
using Microsoft.Extensions.Options;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Http.Features;
using Cms.Api.Data.Context;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Environment
// Environment
if (!builder.Environment.IsEnvironment("Testing"))
{
    Env.Load(Path.Combine(builder.Environment.ContentRootPath, ".env"));
    builder.Configuration.AddEnvironmentVariables();
}

// MVC
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });

// File Upload Limits
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 6 * 1024 * 1024;
});

// Application Services
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddHealthChecks()
    .AddDbContextCheck<CmsDbContext>(
        name: "database",
        tags: ["ready"]);

// API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerDocumentation();

// Error Handling
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// CORS
var allowedOrigins = builder.Configuration["ALLOWED_ORIGINS"]?
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("login", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString()
                          ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));

    options.AddPolicy("upload", httpContext =>
    RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: httpContext.Connection.RemoteIpAddress?.ToString()
                      ?? "unknown",
        factory: _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0
        }));
});

var app = builder.Build();

// Validate critical startup configuration
_ = app.Services
    .GetRequiredService<IOptions<JwtSettings>>()
    .Value;

if (!app.Environment.IsEnvironment("Testing"))
{
    // Database Initialization
    using (var scope = app.Services.CreateScope())
    {
        var initializer =
            scope.ServiceProvider.GetRequiredService<AdminDatabaseInitializer>();

        await initializer.InitializeAsync();
    }
}

// Development Tools
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("Frontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks(
    "/health/live",
    new HealthCheckOptions
    {
        Predicate = _ => false
    });

app.MapHealthChecks(
    "/health/ready",
    new HealthCheckOptions
    {
        Predicate = check => check.Tags.Contains("ready")
    });
    
// Endpoints
app.MapControllers();

app.Run();

public partial class Program
{
}

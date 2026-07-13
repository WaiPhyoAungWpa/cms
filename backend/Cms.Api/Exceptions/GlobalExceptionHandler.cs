using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;

namespace Cms.Api.Exceptions;

/// <summary>
/// Handles unhandled exceptions and returns standardized JSON error responses.
/// </summary>
public sealed class GlobalExceptionHandler : IExceptionHandler
{
    // Field
    private readonly ILogger<GlobalExceptionHandler> _logger;

    // Constructor
    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        httpContext.Response.ContentType = "application/json";

        var (statusCode, message) = exception switch
        {
            ArgumentException ex =>
                (StatusCodes.Status400BadRequest, ex.Message),

            InvalidOperationException ex =>
                (StatusCodes.Status400BadRequest, ex.Message),

            KeyNotFoundException ex =>
                (StatusCodes.Status404NotFound, ex.Message),

            UnauthorizedAccessException ex =>
                (StatusCodes.Status401Unauthorized, ex.Message),

            ExternalServiceException =>
                (StatusCodes.Status502BadGateway,
                "An external service is temporarily unavailable. Please try again later."),

            _ =>
                (StatusCodes.Status500InternalServerError,
                "An unexpected error occurred.")
        };

        if (statusCode >= StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(
                exception,
                "Unhandled exception for {Method} {Path}",
                httpContext.Request.Method,
                httpContext.Request.Path);
        }
        else
        {
            _logger.LogWarning(
                exception,
                "Request failed for {Method} {Path} with status {StatusCode}",
                httpContext.Request.Method,
                httpContext.Request.Path,
                statusCode);
        }

        httpContext.Response.StatusCode = statusCode;

        var response = new
        {
            message
        };

        await httpContext.Response.WriteAsync(
            JsonSerializer.Serialize(response),
            cancellationToken);

        return true;
    }
}
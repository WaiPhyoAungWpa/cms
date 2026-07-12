using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;

namespace Cms.Api.Exceptions;

/// <summary>
/// Handles unhandled exceptions and returns standardized JSON error responses.
/// </summary>
public sealed class GlobalExceptionHandler : IExceptionHandler
{
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

            _ =>
                (StatusCodes.Status500InternalServerError,
                "An unexpected error occurred.")
        };

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
using Cms.Api.DTOs.Auth;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Cms.Api.Controllers;

/// <summary>
/// Provides authentication endpoints for administrators.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Authenticates an administrator and returns a JWT.
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginRequestDto request)
    {
        var result =
            await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(
                "Invalid username or password.");
        }

        return Ok(result);
    }

    /// <summary>
    /// Returns a simple response to verify the current JWT is valid.
    /// </summary>
    [Authorize]
    [HttpGet("profile")]
    public IActionResult Profile()
    {
        return Ok("Authenticated");
    }
}
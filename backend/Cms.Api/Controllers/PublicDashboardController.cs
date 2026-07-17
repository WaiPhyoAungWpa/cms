using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Api.Controllers;

[ApiController]
[Route("api/public/dashboard")]
public class PublicDashboardController : ControllerBase
{
    private readonly IPublicDashboardService _publicDashboardService;
    private readonly ILogger<PublicDashboardController> _logger;

    public PublicDashboardController(
        IPublicDashboardService publicDashboardService,
        ILogger<PublicDashboardController> logger)
    {
        _publicDashboardService = publicDashboardService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboard()
    {
        _logger.LogInformation(
            "Received request to retrieve public dashboard.");

        var dashboard =
            await _publicDashboardService.GetDashboardAsync();

        return Ok(dashboard);
    }
}
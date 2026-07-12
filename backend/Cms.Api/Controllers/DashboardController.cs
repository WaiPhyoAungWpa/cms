using Cms.Api.DTOs.Dashboard;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Api.Controllers;

/// <summary>
/// Provides dashboard summary information for administrators.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IContentService _contentService;

    public DashboardController(IContentService contentService)
    {
        _contentService = contentService;
    }

    /// <summary>
    /// Retrieves the dashboard summary.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<DashboardSummaryResponseDto>> GetSummary()
    {
        var summary = await _contentService.GetDashboardSummaryAsync();

        return Ok(summary);
    }
}
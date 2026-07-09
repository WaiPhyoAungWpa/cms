using Cms.Api.DTOs.Dashboard;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Api.Controllers;

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

    [HttpGet]
    public async Task<ActionResult<DashboardSummaryResponseDto>> GetSummary()
    {
        var summary = await _contentService.GetDashboardSummaryAsync();

        return Ok(summary);
    }
}
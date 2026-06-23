using Cms.Api.DTOs.Content;
using Cms.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ContentController : ControllerBase
{
    private readonly IContentService _contentService;

    public ContentController(IContentService contentService)
    {
        _contentService = contentService;
    }

    [HttpPost("publish")]
    public async Task<IActionResult> Publish(CreateContentRequestDto request)
    {
        var result = await _contentService.PublishAsync(request);

        return Ok(result);
    }

    [HttpPost("draft")]
    public async Task<IActionResult> SaveDraft(CreateContentRequestDto request)
    {
        var result = await _contentService.SaveDraftAsync(request);

        return Ok(result);
    }
}
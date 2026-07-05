using Cms.Api.DTOs.Content;
using Cms.Api.Services.Interfaces;
using Cms.Api.DTOs.Common;
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

    [HttpGet]
    public async Task<ActionResult<PagedResponseDto<ContentListResponseDto>>> GetAll(
        [FromQuery] ContentQueryRequestDto request)
    {
        var contents = await _contentService.GetAllAsync(request);

        return Ok(contents);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ContentDetailResponseDto>> GetById(int id)
    {
        try
        {
            var content = await _contentService.GetByIdAsync(id);
            return Ok(content);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{id:int}/draft")]
    public async Task<ActionResult<ContentResponseDto>> UpdateDraft(
        int id,
        UpdateContentRequestDto request)
    {
        try
        {
            var result = await _contentService.UpdateDraftAsync(id, request);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{id:int}/publish")]
    public async Task<ActionResult<ContentResponseDto>> PublishDraft(
        int id,
        UpdateContentRequestDto request)
    {
        try
        {
            var result = await _contentService.PublishDraftAsync(id, request);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ContentResponseDto>> UpdatePublished(
        int id,
        UpdateContentRequestDto request)
    {
        try
        {
            var result = await _contentService.UpdatePublishedAsync(id, request);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

}
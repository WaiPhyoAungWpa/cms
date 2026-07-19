using Cms.Api.DTOs.Content;
using Cms.Api.Services.Interfaces;
using Cms.Api.DTOs.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Api.Controllers;

/// <summary>
/// Provides endpoints for administrators to create, manage, update,
/// delete, and restore content.
/// </summary>
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

    /// <summary>
    /// Publishes a new content item.
    /// </summary>
    /// <param name="request">The content creation request.</param>
    /// <returns>The created published content.</returns>
    [HttpPost("publish")]
    public async Task<IActionResult> Publish(CreateContentRequestDto request)
    {
        var result = await _contentService.PublishAsync(request);

        return Ok(result);
    }

    /// <summary>
    /// Saves a new content item as a draft.
    /// </summary>
    [HttpPost("draft")]
    public async Task<IActionResult> SaveDraft(CreateContentRequestDto request)
    {
        var result = await _contentService.SaveDraftAsync(request);

        return Ok(result);
    }

    /// <summary>
    /// Retrieves a paginated list of content items.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResponseDto<ContentListResponseDto>>> GetAll(
        [FromQuery] ContentQueryRequestDto request)
    {
        var contents = await _contentService.GetAllAsync(request);

        return Ok(contents);
    }

    /// <summary>
    /// Retrieves the details of a content item.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ContentDetailResponseDto>> GetById(int id)
    {
        var content = await _contentService.GetByIdAsync(id);

        return Ok(content);
    }

    /// <summary>
    /// Retrieves related content options.
    /// </summary>
    [HttpGet("related-options")]
    public async Task<ActionResult<PagedResponseDto<RelatedContentResponseDto>>>
        GetRelatedContentOptions(
            [FromQuery] RelatedContentQueryRequestDto request)
    {
        var result =
            await _contentService.GetRelatedContentOptionsAsync(request);

        return Ok(result);
    }

    /// <summary>
    /// Updates an existing draft.
    /// </summary>
    [HttpPut("{id:int}/draft")]
    public async Task<ActionResult<ContentResponseDto>> UpdateDraft(
        int id,
        UpdateContentRequestDto request)
    {
        var result = await _contentService.UpdateDraftAsync(id, request);

        return Ok(result);
    }

    /// <summary>
    /// Publishes an existing draft.
    /// </summary>
    [HttpPut("{id:int}/publish")]
    public async Task<ActionResult<ContentResponseDto>> PublishDraft(
        int id,
        UpdateContentRequestDto request)
    {
        var result = await _contentService.PublishDraftAsync(id, request);

        return Ok(result);
    }

    /// <summary>
    /// Updates an existing published content item.
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ContentResponseDto>> UpdatePublished(
        int id,
        UpdateContentRequestDto request)
    {
        var result = await _contentService.UpdatePublishedAsync(id, request);

        return Ok(result);
    }

    /// <summary>
    /// Soft-deletes a content item.
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ContentResponseDto>> SoftDelete(int id)
    {
        var result = await _contentService.SoftDeleteAsync(id);

        return Ok(result);
    }

    /// <summary>
    /// Restores a previously soft-deleted content item.
    /// </summary>
    [HttpPut("{id:int}/restore")]
    public async Task<ActionResult<ContentResponseDto>> Restore(
        int id,
        RestoreContentRequestDto request)
    {
        var result = await _contentService.RestoreAsync(id, request);

        return Ok(result);
    }

}
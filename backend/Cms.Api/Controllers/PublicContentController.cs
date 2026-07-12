using Cms.Api.DTOs.PublicContent;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Api.Controllers;

/// <summary>
/// Provides public content endpoints.
/// </summary>
[ApiController]
[Route("api/public/content")]
public class PublicContentController : ControllerBase
{
    private readonly IPublicContentService _publicContentService;

    public PublicContentController(
        IPublicContentService publicContentService)
    {
        _publicContentService = publicContentService;
    }

    /// <summary>
    /// Retrieves a paginated list of published public content.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PublicContentListResponseDto>> GetAll(
        [FromQuery] PublicContentQueryRequestDto request)
    {
        var result = await _publicContentService.GetAllAsync(request);

        return Ok(result);
    }

    /// <summary>
    /// Retrieves the details of a published public content item.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<PublicContentDetailResponseDto>> GetById(int id)
    {
        try
        {
            var content = await _publicContentService.GetByIdAsync(id);

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
}


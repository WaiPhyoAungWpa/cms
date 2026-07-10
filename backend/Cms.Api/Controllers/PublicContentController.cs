using Cms.Api.DTOs.PublicContent;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Api.Controllers;

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

    [HttpGet]
    public async Task<ActionResult<PublicContentListResponseDto>> GetAll(
        [FromQuery] PublicContentQueryRequestDto request)
    {
        var result = await _publicContentService.GetAllAsync(request);

        return Ok(result);
    }
}
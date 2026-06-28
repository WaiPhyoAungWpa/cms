using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Api.Controllers;

[ApiController]
[Route("api/images")]
public class ImagesController : ControllerBase
{
    private readonly IImageService _imageService;

    public ImagesController(IImageService imageService)
    {
        _imageService = imageService;
    }

    [HttpGet("defaults/{categoryId}")]
    public async Task<IActionResult> GetDefaultImages(int categoryId)
    {
        var images = await _imageService.GetDefaultImagesAsync(categoryId);

        return Ok(images);
    }
}
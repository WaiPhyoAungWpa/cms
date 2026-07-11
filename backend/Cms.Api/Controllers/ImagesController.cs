using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

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

    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(
        IFormFile file,
        [FromForm] int categoryId)
    {
        var result = await _imageService.UploadAsync(file, categoryId);

        return Ok(result);
    }
}
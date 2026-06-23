namespace Cms.Api.DTOs.Content;

public class ContentResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string VisibilityStatus { get; set; } = string.Empty;
}
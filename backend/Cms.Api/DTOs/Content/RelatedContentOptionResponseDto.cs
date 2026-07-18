namespace Cms.Api.DTOs.Content;

public class RelatedContentOptionResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;
}
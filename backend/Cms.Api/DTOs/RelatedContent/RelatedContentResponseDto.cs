namespace Cms.Api.DTOs.RelatedContent;

public class RelatedContentResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;
}
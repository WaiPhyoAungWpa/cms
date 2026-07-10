namespace Cms.Api.DTOs.PublicContent;

public class PublicContentDetailResponseDto
{
    public int Id { get; set; }

    public string Category { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;

    public List<PublicContentSectionResponseDto> Sections { get; set; } = [];
}
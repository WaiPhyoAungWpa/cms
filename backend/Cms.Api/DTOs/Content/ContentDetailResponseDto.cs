using Cms.Api.Entities.Enums;

namespace Cms.Api.DTOs.Content;

public class ContentDetailResponseDto
{
    public int Id { get; set; }

    public string Category { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public ContentStatus Status { get; set; }

    public VisibilityStatus VisibilityStatus { get; set; }

    public string CoverImageUrl { get; set; } = string.Empty;

    public List<SectionDetailResponseDto> Sections { get; set; } = [];
}
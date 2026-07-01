using Cms.Api.Entities.Enums;

namespace Cms.Api.DTOs.Content;

public class ContentListResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public ContentStatus Status { get; set; }

    public VisibilityStatus VisibilityStatus { get; set; }
}
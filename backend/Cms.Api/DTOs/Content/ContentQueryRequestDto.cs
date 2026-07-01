using Cms.Api.Entities.Enums;

namespace Cms.Api.DTOs.Content;

public class ContentQueryRequestDto
{
    public string? Search { get; set; }

    public int? CategoryId { get; set; }

    public ContentStatus? Status { get; set; }

    public VisibilityStatus? VisibilityStatus { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}
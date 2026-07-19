namespace Cms.Api.DTOs.Content;

public class RelatedContentQueryRequestDto
{
    public string? Search { get; set; }

    public int? ExcludeId { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}
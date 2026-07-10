namespace Cms.Api.DTOs.PublicContent;

public class PublicLatestContentResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
}
namespace Cms.Api.DTOs.Content;

public class CreateContentRequestDto
{
    public int CategoryId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int CoverImageId { get; set; }

    public string? HyperlinkName { get; set; }

    public string? HyperlinkUrl { get; set; } 

    public List<int> RelatedContentIds { get; set; } = [];

    public List<CreateSectionRequestDto> Sections { get; set; } = [];
}
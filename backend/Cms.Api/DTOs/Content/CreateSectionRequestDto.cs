namespace Cms.Api.DTOs.Content;

public class CreateSectionRequestDto
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int SectionImageId { get; set; }

    public string? HyperlinkName { get; set; } 

    public string? HyperlinkUrl { get; set; }
}
using Cms.Api.DTOs.RelatedContent;

namespace Cms.Api.DTOs.PublicContent;

public class PublicContentDetailResponseDto
{
    public int Id { get; set; }

    public string Category { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;

    public string? HyperlinkName { get; set; }

    public string? HyperlinkUrl { get; set; } 

    public List<RelatedContentResponseDto> RelatedContents { get; set; } = [];

    public List<PublicContentSectionResponseDto> Sections { get; set; } = [];
}
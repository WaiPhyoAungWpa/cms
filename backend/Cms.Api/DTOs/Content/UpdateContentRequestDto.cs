using Cms.Api.Entities.Enums;

namespace Cms.Api.DTOs.Content;

public class UpdateContentRequestDto
{
    public int CategoryId { get; set; }

    public VisibilityStatus VisibilityStatus { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int CoverImageId { get; set; }

    public List<UpdateSectionRequestDto> Sections { get; set; } = [];
}
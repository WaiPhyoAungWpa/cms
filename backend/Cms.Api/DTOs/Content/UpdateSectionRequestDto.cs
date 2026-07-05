namespace Cms.Api.DTOs.Content;

public class UpdateSectionRequestDto
{
    public int? Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int SectionImageId { get; set; }
}
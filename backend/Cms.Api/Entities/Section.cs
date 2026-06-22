namespace Cms.Api.Entities;

public class Section
{
    public int Id { get; set; }

    public int ContentId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int SectionImageId { get; set; }

    // Navigation Properties

    public Content Content { get; set; } = null!;

    public Image SectionImage { get; set; } = null!;
}

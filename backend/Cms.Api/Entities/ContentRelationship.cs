namespace Cms.Api.Entities;

public class ContentRelationship
{
    public int Id { get; set; }

    public int ContentId { get; set; }

    public int RelatedContentId { get; set; }

    public Content Content { get; set; } = null!;

    public Content RelatedContent { get; set; } = null!;
}
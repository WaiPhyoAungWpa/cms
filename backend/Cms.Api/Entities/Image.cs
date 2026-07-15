using Cms.Api.Entities.Enums;

namespace Cms.Api.Entities;

public class Image
{
    public int Id { get; set; }

    public ImageType Type { get; set; }

    public int CategoryId { get; set; }

    public string FilePath { get; set; } = string.Empty;

    public string? StoragePublicId { get; set; }

    // Navigation Property
    public Category Category { get; set; } = null!;

    public ICollection<Content> Contents { get; set; } = new List<Content>();

    public ICollection<Section> Sections { get; set; } = new List<Section>();
}

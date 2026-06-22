using Cms.Api.Entities.Enums;

namespace Cms.Api.Entities;

public class Content
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int CoverImageId { get; set; }

    public int CategoryId { get; set; }

    public ContentStatus Status { get; set; }

    public ContentStatus? PreviousStatus { get; set; }

    public VisibilityStatus VisibilityStatus { get; set; }

    public DateTime CreatedAt { get; set; }

    public int CreatedByAdminId { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int UpdatedByAdminId { get; set; }

    // Navigation Properties

    public Image CoverImage { get; set; } = null!;

    public Category Category { get; set; } = null!;

    public Admin CreatedByAdmin { get; set; } = null!;

    public Admin UpdatedByAdmin { get; set; } = null!;

    public ICollection<Section> Sections { get; set; } = new List<Section>();
}
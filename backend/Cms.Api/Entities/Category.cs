namespace Cms.Api.Entities;

public class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ICollection<Content> Contents { get; set; } = new List<Content>();

    public ICollection<Image> Images { get; set; } = new List<Image>();
}

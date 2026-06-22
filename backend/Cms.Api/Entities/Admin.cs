namespace Cms.Api.Entities;

public class Admin
{
    public int Id { get; set; }

    public string Username { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<Content> CreatedContents { get; set; } = new List<Content>();

    public ICollection<Content> UpdatedContents { get; set; } = new List<Content>();
}

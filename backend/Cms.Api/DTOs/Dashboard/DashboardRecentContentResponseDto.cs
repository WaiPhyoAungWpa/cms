using Cms.Api.Entities.Enums;

namespace Cms.Api.DTOs.Dashboard;

public class DashboardRecentContentResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public ContentStatus Status { get; set; }

    public DateTime UpdatedAt { get; set; }
}
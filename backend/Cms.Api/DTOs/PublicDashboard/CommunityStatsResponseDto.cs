namespace Cms.Api.DTOs.PublicDashboard;

public class CommunityStatsResponseDto
{
    public int TotalReaders { get; set; }

    public int TotalViews { get; set; }

    public int PublishedContent { get; set; }

    public int Categories { get; set; }
}
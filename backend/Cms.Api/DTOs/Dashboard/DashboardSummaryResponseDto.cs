namespace Cms.Api.DTOs.Dashboard;

public class DashboardSummaryResponseDto
{
    public int TotalCount { get; set; }

    public int PublishedCount { get; set; }

    public int DraftCount { get; set; }

    public int SoftDeletedCount { get; set; }

    public List<DashboardRecentContentResponseDto> RecentContents { get; set; } = [];
}
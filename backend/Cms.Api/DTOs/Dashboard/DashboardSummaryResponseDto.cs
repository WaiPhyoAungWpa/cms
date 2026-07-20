namespace Cms.Api.DTOs.Dashboard;

public class DashboardSummaryResponseDto
{
    // CMS Database
    public int TotalCount { get; set; }

    public int PublishedCount { get; set; }

    public int DraftCount { get; set; }

    public int SoftDeletedCount { get; set; }

    public List<DashboardRecentContentResponseDto> RecentContents { get; set; } = [];

    public List<DashboardCategoryDistributionResponseDto> CategoryDistribution { get; set; } = [];

    public DateTime LastUpdated { get; set; }

    public string DataSource { get; set; } = string.Empty;

    // Google Analytics
    public int TotalReaders { get; set; }

    public int TotalViews { get; set; }

    public List<DashboardMonthlyViewResponseDto> MonthlyViews { get; set; } = [];

    public List<DashboardPopularContentResponseDto> PopularContents { get; set; } = [];

    public List<DashboardTrafficSourceResponseDto> TrafficSources { get; set; } = [];
}
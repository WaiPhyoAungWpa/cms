namespace Cms.Api.DTOs.PublicDashboard;

public class PublicDashboardResponseDto
{
    public CommunityStatsResponseDto Stats { get; set; } = new();

    public List<MonthlyViewResponseDto> MonthlyViews { get; set; } = [];

    public DateTime LastUpdated { get; set; }

    public string DataSource { get; set; } = string.Empty;
}
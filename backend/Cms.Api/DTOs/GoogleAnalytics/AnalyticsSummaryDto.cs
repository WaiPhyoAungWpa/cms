namespace Cms.Api.DTOs.GoogleAnalytics;

public class AnalyticsSummaryDto
{
    public int TotalReaders { get; set; }

    public int TotalViews { get; set; }

    public List<MonthlyViewDto> MonthlyViews { get; set; } = [];

    public List<PopularContentDto> PopularContents { get; set; } = [];

    public List<TrafficSourceDto> TrafficSources { get; set; } = [];
}
namespace Cms.Api.DTOs.GoogleAnalytics;

public class TrafficSourceDto
{
    public string Source { get; set; } = string.Empty;

    public int Sessions { get; set; }
}
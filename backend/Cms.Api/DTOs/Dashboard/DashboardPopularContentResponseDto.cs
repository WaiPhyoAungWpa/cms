namespace Cms.Api.DTOs.Dashboard;

public class DashboardPopularContentResponseDto
{
    public string Title { get; set; } = string.Empty;

    public string PagePath { get; set; } = string.Empty;

    public int Views { get; set; }
}
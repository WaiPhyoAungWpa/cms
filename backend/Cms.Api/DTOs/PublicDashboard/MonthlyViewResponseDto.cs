namespace Cms.Api.DTOs.PublicDashboard;

public class MonthlyViewResponseDto
{
    public string Month { get; set; } = string.Empty;

    public int Views { get; set; }
}
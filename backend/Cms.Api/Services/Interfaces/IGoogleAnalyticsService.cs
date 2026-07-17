using Cms.Api.DTOs.GoogleAnalytics;

namespace Cms.Api.Services.Interfaces;

public interface IGoogleAnalyticsService
{
    Task<AnalyticsSummaryDto> GetAnalyticsSummaryAsync();
}
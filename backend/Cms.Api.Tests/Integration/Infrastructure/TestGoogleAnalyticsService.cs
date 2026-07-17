using Cms.Api.DTOs.GoogleAnalytics;
using Cms.Api.Services.Interfaces;

namespace Cms.Api.Tests.Integration.Infrastructure;

/// <summary>
/// Test implementation of IGoogleAnalyticsService that returns
/// deterministic analytics data without calling Google Analytics.
/// </summary>
public sealed class TestGoogleAnalyticsService : IGoogleAnalyticsService
{
    public Task<AnalyticsSummaryDto> GetAnalyticsSummaryAsync()
    {
        return Task.FromResult(new AnalyticsSummaryDto
        {
            TotalReaders = 100,
            TotalViews = 1000,
            MonthlyViews = []
        });
    }
}
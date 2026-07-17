using System.Globalization;
using Cms.Api.Configurations;
using Cms.Api.DTOs.GoogleAnalytics;
using Cms.Api.Services.Interfaces;
using Google.Apis.Auth.OAuth2;
using Google.Analytics.Data.V1Beta;
using Microsoft.Extensions.Options;

namespace Cms.Api.Services;

public class GoogleAnalyticsService : IGoogleAnalyticsService
{
    private readonly GoogleAnalyticsSettings _settings;
    private readonly ILogger<GoogleAnalyticsService> _logger;
    private readonly BetaAnalyticsDataClient _client;

    public GoogleAnalyticsService(
        IOptions<GoogleAnalyticsSettings> options,
        ILogger<GoogleAnalyticsService> logger)
    {
        _settings = options.Value;
        _logger = logger;

        ArgumentException.ThrowIfNullOrWhiteSpace(
            _settings.PropertyId,
            nameof(_settings.PropertyId));

        var credentialsPath = Environment.GetEnvironmentVariable(
            "GOOGLE_APPLICATION_CREDENTIALS")
            ?? throw new InvalidOperationException(
                "GOOGLE_APPLICATION_CREDENTIALS environment variable is not configured.");

        var credential = CredentialFactory
            .FromFile<ServiceAccountCredential>(credentialsPath)
            .ToGoogleCredential();

        _client = new BetaAnalyticsDataClientBuilder
        {
            Credential = credential
        }.Build();
    }

    public async Task<AnalyticsSummaryDto> GetAnalyticsSummaryAsync()
    {
        try
        {
            return new AnalyticsSummaryDto
            {
                TotalReaders = await GetTotalReadersAsync(),
                TotalViews = await GetTotalViewsAsync(),
                MonthlyViews = await GetMonthlyViewsAsync()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to retrieve Google Analytics dashboard data.");

            throw;
        }
    }

    private Task<int> GetTotalReadersAsync() =>
        GetMetricValueAsync("totalUsers");

    private Task<int> GetTotalViewsAsync() =>
        GetMetricValueAsync("screenPageViews");

    private async Task<int> GetMetricValueAsync(string metricName)
    {
        try
        {
            var request = new RunReportRequest
            {
                Property = $"properties/{_settings.PropertyId}",
                Metrics =
                {
                    new Metric { Name = metricName }
                },
                DateRanges =
                {
                    new DateRange
                    {
                        StartDate = "30daysAgo",
                        EndDate = "today"
                    }
                }
            };

            var response = await _client.RunReportAsync(request);

            var value = response.Rows.Count == 0 ||
                        !int.TryParse(
                            response.Rows[0].MetricValues[0].Value,
                            out var parsedValue)
                ? 0
                : parsedValue;

            _logger.LogInformation(
                "Retrieved Google Analytics metric '{MetricName}': {Value}.",
                metricName,
                value);

            return value;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to retrieve Google Analytics metric '{MetricName}'.",
                metricName);

            throw;
        }
    }

    private async Task<List<MonthlyViewDto>> GetMonthlyViewsAsync()
    {
        try
        {
            var request = new RunReportRequest
            {
                Property = $"properties/{_settings.PropertyId}",
                Dimensions =
                {
                    new Dimension
                    {
                        Name = "yearMonth"
                    }
                },
                Metrics =
                {
                    new Metric
                    {
                        Name = "screenPageViews"
                    }
                },
                DateRanges =
                {
                    new DateRange
                    {
                        StartDate = DateTime.UtcNow
                            .AddMonths(-11)
                            .ToString("yyyy-MM-dd"),
                        EndDate = "today"
                    }
                },
                OrderBys =
                {
                    new OrderBy
                    {
                        Dimension = new OrderBy.Types.DimensionOrderBy
                        {
                            DimensionName = "yearMonth"
                        }
                    }
                }
            };

            var response = await _client.RunReportAsync(request);

            var monthlyViews = new List<MonthlyViewDto>();

            foreach (var row in response.Rows)
            {
                var yearMonth = row.DimensionValues[0].Value;

                if (!int.TryParse(row.MetricValues[0].Value, out var views))
                {
                    views = 0;
                }

                monthlyViews.Add(new MonthlyViewDto
                {
                    Month = FormatYearMonth(yearMonth),
                    Views = views
                });
            }

            _logger.LogInformation(
                "Retrieved {Count} monthly analytics record(s).",
                monthlyViews.Count);

            return monthlyViews;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to retrieve monthly Google Analytics data.");

            throw;
        }
    }

    private static string FormatYearMonth(string yearMonth)
    {
        var date = DateTime.ParseExact(
            yearMonth,
            "yyyyMM",
            CultureInfo.InvariantCulture);

        return date.ToString("MMM");
    }
}
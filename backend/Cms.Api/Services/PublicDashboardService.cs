using Cms.Api.DTOs.PublicDashboard;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services.Interfaces;

namespace Cms.Api.Services;

public class PublicDashboardService : IPublicDashboardService
{
    private readonly IPublicDashboardRepository _repository;
    private readonly IGoogleAnalyticsService _googleAnalyticsService;
    private readonly ILogger<PublicDashboardService> _logger;

    public PublicDashboardService(
        IPublicDashboardRepository repository,
        IGoogleAnalyticsService googleAnalyticsService,
        ILogger<PublicDashboardService> logger)
    {
        _repository = repository;
        _googleAnalyticsService = googleAnalyticsService;
        _logger = logger;
    }

    public async Task<PublicDashboardResponseDto> GetDashboardAsync()
    {
        try
        {
            var analytics =
                await _googleAnalyticsService.GetAnalyticsSummaryAsync();

            var publishedContent =
                await _repository.GetPublishedContentCountAsync();

            var categories =
                await _repository.GetCategoryCountAsync();

            var response = new PublicDashboardResponseDto
            {
                Stats = new CommunityStatsResponseDto
                {
                    TotalReaders = analytics.TotalReaders,
                    TotalViews = analytics.TotalViews,
                    PublishedContent = publishedContent,
                    Categories = categories
                },

                MonthlyViews =
                [
                    .. analytics.MonthlyViews.Select(month =>
                        new MonthlyViewResponseDto
                        {
                            Month = month.Month,
                            Views = month.Views
                        })
                ],

                LastUpdated = DateTime.UtcNow,

                DataSource = "Google Analytics + CMS Database"
            };

            _logger.LogInformation(
                "Retrieved public dashboard successfully.");

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to retrieve public dashboard.");

            throw;
        }
    }
}
using Cms.Api.DTOs.PublicDashboard;

namespace Cms.Api.Services.Interfaces;

public interface IPublicDashboardService
{
    Task<PublicDashboardResponseDto> GetDashboardAsync();
}
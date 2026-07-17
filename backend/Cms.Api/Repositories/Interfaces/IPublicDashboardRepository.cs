namespace Cms.Api.Repositories.Interfaces;

public interface IPublicDashboardRepository
{
    Task<int> GetPublishedContentCountAsync();

    Task<int> GetCategoryCountAsync();
}
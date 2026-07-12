namespace Cms.Api.Services.Interfaces;

/// <summary>
/// Provides access to the currently authenticated administrator.
/// </summary>
public interface ICurrentAdminService
{
    /// <summary>
    /// Gets the authenticated administrator's identifier.
    /// </summary>
    int GetAdminId();
}
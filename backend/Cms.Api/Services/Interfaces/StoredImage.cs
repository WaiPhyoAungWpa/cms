namespace Cms.Api.Services.Interfaces;

/// <summary>
/// Represents an image successfully stored by the configured image provider.
/// </summary>
public sealed record StoredImage(
    string Url,
    string PublicId);
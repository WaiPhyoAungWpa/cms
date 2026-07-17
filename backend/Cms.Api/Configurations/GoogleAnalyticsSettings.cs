namespace Cms.Api.Configurations;

public class GoogleAnalyticsSettings
{
    public const string SectionName = "GoogleAnalytics";

    public string PropertyId { get; set; } = string.Empty;

    public string CredentialsPath { get; set; } = string.Empty;
}
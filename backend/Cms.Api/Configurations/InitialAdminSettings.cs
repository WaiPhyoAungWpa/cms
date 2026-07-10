namespace Cms.Api.Configurations;

public class InitialAdminSettings
{
    public const string SectionName = "InitialAdmin";

    public string Username { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}
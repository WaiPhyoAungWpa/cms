namespace Cms.Api.Configurations;

public class ImageUploadSettings
{
    public const string SectionName = "ImageUpload";

    public long MaxFileSize { get; set; }

    public string[] AllowedExtensions { get; set; } = [];

    public string[] AllowedContentTypes { get; set; } = [];
}
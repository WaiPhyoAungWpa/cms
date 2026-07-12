using Cms.Api.Constants;

namespace Cms.Api.Helpers;

public static class ImageFolderHelper
{
    public static string GetFolder(int categoryId)
    {
        return categoryId switch
        {
            CategoryIds.Experience => ImageStorageFolders.Experience,
            CategoryIds.Learning => ImageStorageFolders.Learning,
            CategoryIds.Lifestyle => ImageStorageFolders.Lifestyle,
            _ => throw new ArgumentException("Invalid category.")
        };
    }
}
namespace Cms.Api.Helpers;
public static class ImageFolderHelper
{
    public static string GetFolder(int categoryId)
    {
        return categoryId switch
        {
            1 => "cms/experience",
            2 => "cms/learning",
            3 => "cms/lifestyle",
            _ => "cms"
        };
    }
}
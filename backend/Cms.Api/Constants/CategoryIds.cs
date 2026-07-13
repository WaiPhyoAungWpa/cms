namespace Cms.Api.Constants;

public static class CategoryIds
{
    public const int Experience = 1;

    public const int Learning = 2;

    public const int Lifestyle = 3;

    public static bool IsValid(int categoryId)
    {
        return categoryId is Experience or Learning or Lifestyle;
    }
}
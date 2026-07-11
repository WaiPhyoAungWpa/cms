namespace Cms.Api.Validators;

public static class PaginationValidator
{
    private const int MaxPageSize = 100;

    public static void Validate(int page, int pageSize)
    {
        if (page < 1)
        {
            throw new ArgumentException(
                "Page must be greater than or equal to 1.");
        }

        if (pageSize < 1)
        {
            throw new ArgumentException(
                "Page size must be greater than or equal to 1.");
        }

        if (pageSize > MaxPageSize)
        {
            throw new ArgumentException(
                $"Page size cannot exceed {MaxPageSize}.");
        }
    }
}
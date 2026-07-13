using Cms.Api.Constants;

namespace Cms.Api.Tests.Constants;

public class CategoryIdsTests
{
    [Theory]
    [InlineData(CategoryIds.Experience)]
    [InlineData(CategoryIds.Learning)]
    [InlineData(CategoryIds.Lifestyle)]
    public void IsValid_ReturnsTrue_ForKnownCategoryIds(int categoryId)
    {
        var result = CategoryIds.IsValid(categoryId);

        Assert.True(result);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(4)]
    [InlineData(999)]
    public void IsValid_ReturnsFalse_ForUnknownCategoryIds(int categoryId)
    {
        var result = CategoryIds.IsValid(categoryId);

        Assert.False(result);
    }
}
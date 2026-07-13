using Cms.Api.Validators;

namespace Cms.Api.Tests.Validators;

public class PaginationValidatorTests
{
    [Theory]
    [InlineData(0, 10)]
    [InlineData(-1, 10)]
    public void Validate_ThrowsArgumentException_WhenPageIsLessThanOne(
        int page,
        int pageSize)
    {
        Assert.Throws<ArgumentException>(
            () => PaginationValidator.Validate(page, pageSize));
    }

    [Theory]
    [InlineData(1, 0)]
    [InlineData(1, -1)]
    public void Validate_ThrowsArgumentException_WhenPageSizeIsLessThanOne(
        int page,
        int pageSize)
    {
        Assert.Throws<ArgumentException>(
            () => PaginationValidator.Validate(page, pageSize));
    }

    [Theory]
    [InlineData(1, 101)]
    [InlineData(5, 200)]
    public void Validate_ThrowsArgumentException_WhenPageSizeExceedsMaximum(
        int page,
        int pageSize)
    {
        Assert.Throws<ArgumentException>(
            () => PaginationValidator.Validate(page, pageSize));
    }

    [Theory]
    [InlineData(1, 1)]
    [InlineData(1, 20)]
    [InlineData(10, 100)]
    public void Validate_DoesNotThrow_WhenPaginationIsValid(
        int page,
        int pageSize)
    {
        var exception = Record.Exception(
            () => PaginationValidator.Validate(page, pageSize));

        Assert.Null(exception);
    }
}
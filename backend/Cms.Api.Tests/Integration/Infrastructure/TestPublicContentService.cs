using Cms.Api.DTOs.PublicContent;
using Cms.Api.Services.Interfaces;

namespace Cms.Api.Tests.Integration.Infrastructure;

/// <summary>
/// Produces controlled public-content outcomes for global error-handler tests.
/// </summary>
public sealed class TestPublicContentService : IPublicContentService
{
    public Task<PublicContentListResponseDto> GetAllAsync(
        PublicContentQueryRequestDto request)
    {
        return Task.FromResult(new PublicContentListResponseDto());
    }

    public Task<PublicContentDetailResponseDto> GetByIdAsync(int id)
    {
        if (id == 404)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        throw new Exception("Test exception.");
    }
}
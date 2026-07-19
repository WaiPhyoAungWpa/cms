using Cms.Api.DTOs.Common;
using Cms.Api.DTOs.RelatedContent;
using Cms.Api.DTOs.PublicContent;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services.Interfaces;
using Cms.Api.Validators;

namespace Cms.Api.Services;

public class PublicContentService : IPublicContentService
{
    private readonly IContentRepository _contentRepository;

    public PublicContentService(IContentRepository contentRepository)
    {
        _contentRepository = contentRepository;
    }

    public async Task<PublicContentListResponseDto> GetAllAsync(
        PublicContentQueryRequestDto request)
    {
        PaginationValidator.Validate(request.Page, request.PageSize);

        var (items, totalCount) =
            await _contentRepository.GetAllPublicAsync(request);

        var (
            latestContent,
            publicTotalCount,
            experienceCount,
            learningCount,
            lifestyleCount
        ) = await _contentRepository.GetPublicSummaryAsync();

        return new PublicContentListResponseDto
        {
            Contents = new PagedResponseDto<PublicContentListItemResponseDto>
            {
                Items = items
                    .Select(content => new PublicContentListItemResponseDto
                    {
                        Id = content.Id,
                        Title = content.Title,
                        Category = content.Category.Name,
                        CoverImageUrl = content.CoverImage.FilePath
                    })
                    .ToList(),

                Page = request.Page,
                PageSize = request.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(
                    totalCount / (double)request.PageSize)
            },

            LatestContent = latestContent is null
                ? null
                : new PublicLatestContentResponseDto
                {
                    Id = latestContent.Id,
                    Title = latestContent.Title,
                    Description = latestContent.Description,
                    Category = latestContent.Category.Name,
                    CoverImageUrl = latestContent.CoverImage.FilePath
                },

            Stats = new PublicContentStatsResponseDto
            {
                Total = publicTotalCount,
                Experience = experienceCount,
                Learning = learningCount,
                Lifestyle = lifestyleCount
            }
        };
    }

    public async Task<PublicContentDetailResponseDto> GetByIdAsync(int id)
    {
        var content = await _contentRepository.GetPublishedByIdAsync(id);

        if (content is null)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        return new PublicContentDetailResponseDto
        {
            Id = content.Id,
            Category = content.Category.Name,
            Title = content.Title,
            Description = content.Description,
            CoverImageUrl = content.CoverImage.FilePath,
            HyperlinkName = content.HyperlinkName,
            HyperlinkUrl = content.HyperlinkUrl,
            Sections = content.Sections
                .Select(section => new PublicContentSectionResponseDto
                {
                    Id = section.Id,
                    Title = section.Title,
                    Description = section.Description,
                    ImageUrl = section.SectionImage.FilePath,
                    HyperlinkName = section.HyperlinkName,
                    HyperlinkUrl = section.HyperlinkUrl
                })
                .ToList(),

            RelatedContents = content.RelatedContents
                .Select(relationship => new RelatedContentResponseDto
                {
                    Id = relationship.RelatedContent.Id,
                    Category = relationship.RelatedContent.Category.Name,
                    Title = relationship.RelatedContent.Title,
                    CoverImageUrl = relationship.RelatedContent.CoverImage.FilePath
                })
                .ToList()
        };
    }

}
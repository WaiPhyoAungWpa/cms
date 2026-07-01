using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.Common;
using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services.Interfaces;

namespace Cms.Api.Services;

public class ContentService : IContentService
{
    private readonly IContentRepository _contentRepository;

    private static void ValidateRequest(CreateContentRequestDto request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (request.CategoryId <= 0)
            throw new ArgumentException("Category is required.");

        if (string.IsNullOrWhiteSpace(request.Title))
            throw new ArgumentException("Title is required.");

        if (string.IsNullOrWhiteSpace(request.Description))
            throw new ArgumentException("Description is required.");

        if (request.CoverImageId <= 0)
            throw new ArgumentException("Cover image is required.");

        foreach (var section in request.Sections)
        {
            if (string.IsNullOrWhiteSpace(section.Title))
                throw new ArgumentException("Section title is required.");

            if (string.IsNullOrWhiteSpace(section.Description))
                throw new ArgumentException("Section description is required.");

            if (section.SectionImageId <= 0)
                throw new ArgumentException("Section image is required.");
        }
    }

    private static Content BuildContent(
        CreateContentRequestDto request,
        ContentStatus status,
        VisibilityStatus visibilityStatus)
    {
        return new Content
        {
            CategoryId = request.CategoryId,
            Title = request.Title,
            Description = request.Description,
            CoverImageId = request.CoverImageId,

            Status = status,
            VisibilityStatus = visibilityStatus,

            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,

            CreatedByAdminId = 1,
            UpdatedByAdminId = 1,

            Sections = request.Sections.Select(section => new Section
            {
                Title = section.Title,
                Description = section.Description,
                SectionImageId = section.SectionImageId
            }).ToList()
        };
    }

    private static ContentResponseDto MapToResponse(Content content)
    {
        return new ContentResponseDto
        {
            Id = content.Id,
            Title = content.Title,
            Status = content.Status.ToString(),
            VisibilityStatus = content.VisibilityStatus.ToString()
        };
    }

    public ContentService(IContentRepository contentRepository)
    {
        _contentRepository = contentRepository;
    }

    public async Task<ContentResponseDto> PublishAsync(CreateContentRequestDto request)
    {
        ValidateRequest(request);

        var content = BuildContent(
            request,
            ContentStatus.Published,
            VisibilityStatus.Public);

        await _contentRepository.AddAsync(content);
        await _contentRepository.SaveChangesAsync();

        return MapToResponse(content);
    }

    public async Task<ContentResponseDto> SaveDraftAsync(CreateContentRequestDto request)
    {
        ValidateRequest(request);

        var content = BuildContent(
            request,
            ContentStatus.Draft,
            VisibilityStatus.Private);

        await _contentRepository.AddAsync(content);
        await _contentRepository.SaveChangesAsync();

        return MapToResponse(content);
    }

    public async Task<PagedResponseDto<ContentListResponseDto>>
        GetAllAsync(ContentQueryRequestDto request)
    {
        var result = await _contentRepository.GetAllAsync(request);

        var items = result.Items.Select(content => new ContentListResponseDto
        {
            Id = content.Id,
            Title = content.Title,
            Category = content.Category.Name,
            Status = content.Status,
            VisibilityStatus = content.VisibilityStatus
        }).ToList();

        return new PagedResponseDto<ContentListResponseDto>
        {
            Items = items,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = result.TotalCount,
            TotalPages = (int)Math.Ceiling(
                result.TotalCount / (double)request.PageSize)
        };
    }
}
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

    public async Task<ContentDetailResponseDto> GetByIdAsync(int id)
    {
        var content = await _contentRepository.GetByIdAsync(id);

        if (content is null)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        return MapToDetailResponse(content);
    }

    private static ContentDetailResponseDto MapToDetailResponse(Content content)
    {
        return new ContentDetailResponseDto
        {
            Id = content.Id,
            CategoryId = content.CategoryId,
            Category = content.Category.Name,
            Title = content.Title,
            Description = content.Description,
            Status = content.Status,
            VisibilityStatus = content.VisibilityStatus,
            CoverImageId = content.CoverImageId,
            CoverImageUrl = content.CoverImage.FilePath,
            Sections = content.Sections
                .Select(section => new SectionDetailResponseDto
                {
                    Id = section.Id,
                    Title = section.Title,
                    Description = section.Description,
                    SectionImageId = section.SectionImageId,
                    ImageUrl = section.SectionImage.FilePath
                })
                .ToList()
        };
    }

    private static void ValidateRequest(UpdateContentRequestDto request)
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

    private static void ApplyUpdates(
        Content content,
        UpdateContentRequestDto request)
    {
        content.CategoryId = request.CategoryId;
        content.VisibilityStatus = request.VisibilityStatus;
        content.Title = request.Title;
        content.Description = request.Description;
        content.CoverImageId = request.CoverImageId;
        content.UpdatedAt = DateTime.UtcNow;
        content.UpdatedByAdminId = 1;

        var requestedExistingSectionIds = request.Sections
            .Where(section => section.Id.HasValue)
            .Select(section => section.Id!.Value)
            .ToHashSet();

        var sectionsToRemove = content.Sections
            .Where(section => !requestedExistingSectionIds.Contains(section.Id))
            .ToList();

        foreach (var section in sectionsToRemove)
        {
            content.Sections.Remove(section);
        }

        foreach (var sectionRequest in request.Sections)
        {
            if (sectionRequest.Id.HasValue)
            {
                var existingSection = content.Sections
                    .FirstOrDefault(section =>
                        section.Id == sectionRequest.Id.Value);

                if (existingSection is null)
                {
                    throw new ArgumentException(
                        $"Section {sectionRequest.Id.Value} does not belong to this content.");
                }

                existingSection.Title = sectionRequest.Title;
                existingSection.Description = sectionRequest.Description;
                existingSection.SectionImageId = sectionRequest.SectionImageId;
            }
            else
            {
                content.Sections.Add(new Section
                {
                    Title = sectionRequest.Title,
                    Description = sectionRequest.Description,
                    SectionImageId = sectionRequest.SectionImageId
                });
            }
        }
    }

    public async Task<ContentResponseDto> UpdateDraftAsync(
        int id,
        UpdateContentRequestDto request)
    {
        ValidateRequest(request);

        var content = await _contentRepository.GetByIdForUpdateAsync(id);

        if (content is null)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        if (content.Status != ContentStatus.Draft)
        {
            throw new InvalidOperationException(
                "Only draft content can be saved as draft.");
        }

        ApplyUpdates(content, request);

        content.Status = ContentStatus.Draft;

        await _contentRepository.SaveChangesAsync();

        return MapToResponse(content);
    }

    public async Task<ContentResponseDto> PublishDraftAsync(
        int id,
        UpdateContentRequestDto request)
    {
        ValidateRequest(request);

        var content = await _contentRepository.GetByIdForUpdateAsync(id);

        if (content is null)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        if (content.Status != ContentStatus.Draft)
        {
            throw new InvalidOperationException(
                "Only draft content can be published.");
        }

        ApplyUpdates(content, request);

        content.Status = ContentStatus.Published;

        await _contentRepository.SaveChangesAsync();

        return MapToResponse(content);
    }

    public async Task<ContentResponseDto> UpdatePublishedAsync(
        int id,
        UpdateContentRequestDto request)
    {
        ValidateRequest(request);

        var content = await _contentRepository.GetByIdForUpdateAsync(id);

        if (content is null)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        if (content.Status != ContentStatus.Published)
        {
            throw new InvalidOperationException(
                "Only published content can be updated.");
        }

        ApplyUpdates(content, request);

        content.Status = ContentStatus.Published;

        await _contentRepository.SaveChangesAsync();

        return MapToResponse(content);
    }

    public async Task<ContentResponseDto> SoftDeleteAsync(int id)
    {
        var content = await _contentRepository.GetByIdForDeleteAsync(id);

        if (content is null)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        if (content.Status != ContentStatus.Draft &&
            content.Status != ContentStatus.Published)
        {
            throw new InvalidOperationException(
                "Only draft or published content can be deleted.");
        }

        content.PreviousStatus = content.Status;
        content.Status = ContentStatus.SoftDeleted;
        content.UpdatedAt = DateTime.UtcNow;
        content.UpdatedByAdminId = 1;

        await _contentRepository.SaveChangesAsync();

        return MapToResponse(content);
    }

}
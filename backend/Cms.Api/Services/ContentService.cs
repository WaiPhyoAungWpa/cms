using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.Common;
using Cms.Api.DTOs.Dashboard;
using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services.Interfaces;
using Cms.Api.Validators;

namespace Cms.Api.Services;

public class ContentService : IContentService
{
    // Private types
    private readonly IContentRepository _contentRepository;
    private readonly ICurrentAdminService _currentAdminService;

    private readonly record struct SectionValidationData(
        string Title,
        string Description,
        int SectionImageId);

    // Constructor
    public ContentService(
        IContentRepository contentRepository,
        ICurrentAdminService currentAdminService)
    {
        _contentRepository = contentRepository;
        _currentAdminService = currentAdminService;
    }

    // Validation Helpers
    private static void ValidateRequest(CreateContentRequestDto request)
    {
        ArgumentNullException.ThrowIfNull(request);

        ValidateContentFields(
            request.CategoryId,
            request.Title,
            request.Description,
            request.CoverImageId,
            request.Sections.Select(s =>
                new SectionValidationData(
                    s.Title,
                    s.Description,
                    s.SectionImageId))
        );
    }

    private static void ValidateRequest(UpdateContentRequestDto request)
    {
        ArgumentNullException.ThrowIfNull(request);

        ValidateContentFields(
            request.CategoryId,
            request.Title,
            request.Description,
            request.CoverImageId,
            request.Sections.Select(s =>
                new SectionValidationData(
                    s.Title,
                    s.Description,
                    s.SectionImageId))
        );
    }

    private static void ValidateContentFields(
        int categoryId,
        string title,
        string description,
        int coverImageId,
        IEnumerable<SectionValidationData> sections)
    {
        if (categoryId <= 0)
            throw new ArgumentException("Category is required.");

        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.");

        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Description is required.");

        if (coverImageId <= 0)
            throw new ArgumentException("Cover image is required.");

        foreach (var section in sections)
        {
            if (string.IsNullOrWhiteSpace(section.Title))
                throw new ArgumentException("Section title is required.");

            if (string.IsNullOrWhiteSpace(section.Description))
                throw new ArgumentException("Section description is required.");

            if (section.SectionImageId <= 0)
                throw new ArgumentException("Section image is required.");
        }
    }

    // Mapping Helpers
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

    // Entitiy Helpers
    private Content BuildContent(
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

            CreatedByAdminId = _currentAdminService.GetAdminId(),
            UpdatedByAdminId = _currentAdminService.GetAdminId(),

            Sections = request.Sections.Select(section => new Section
            {
                Title = section.Title,
                Description = section.Description,
                SectionImageId = section.SectionImageId
            }).ToList()
        };
    }

    private void ApplyUpdates(
        Content content,
        UpdateContentRequestDto request)
    {
        content.CategoryId = request.CategoryId;
        content.VisibilityStatus = request.VisibilityStatus;
        content.Title = request.Title;
        content.Description = request.Description;
        content.CoverImageId = request.CoverImageId;
        content.UpdatedAt = DateTime.UtcNow;
        content.UpdatedByAdminId = _currentAdminService.GetAdminId();

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

    // Public methods
    // Create
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


    // Read
    public async Task<PagedResponseDto<ContentListResponseDto>>
        GetAllAsync(ContentQueryRequestDto request)
    {
        PaginationValidator.Validate(request.Page, request.PageSize);

        var result = await _contentRepository.GetAllAsync(request);

        var items = result.Items.Select(content => new ContentListResponseDto
        {
            Id = content.Id,
            Title = content.Title,
            Category = content.Category.Name,
            Status = content.Status,
            VisibilityStatus = content.VisibilityStatus,
            PreviousStatus = content.PreviousStatus
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

    // Update
    private async Task<ContentResponseDto> UpdateContentAsync(
        int id,
        UpdateContentRequestDto request,
        ContentStatus requiredStatus,
        ContentStatus targetStatus,
        string invalidStatusMessage)
    {
        ValidateRequest(request);

        var content = await _contentRepository.GetByIdTrackedAsync(id);

        if (content is null)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        if (content.Status != requiredStatus)
        {
            throw new InvalidOperationException(invalidStatusMessage);
        }

        ApplyUpdates(content, request);

        content.Status = targetStatus;

        await _contentRepository.SaveChangesAsync();

        return MapToResponse(content);
    }

    public Task<ContentResponseDto> UpdateDraftAsync(
        int id,
        UpdateContentRequestDto request)
    {
        return UpdateContentAsync(
            id,
            request,
            ContentStatus.Draft,
            ContentStatus.Draft,
            "Only draft content can be saved as draft.");
    }

    public Task<ContentResponseDto> PublishDraftAsync(
        int id,
        UpdateContentRequestDto request)
    {
        return UpdateContentAsync(
            id,
            request,
            ContentStatus.Draft,
            ContentStatus.Published,
            "Only draft content can be published.");
    }

    public Task<ContentResponseDto> UpdatePublishedAsync(
        int id,
        UpdateContentRequestDto request)
    {
        return UpdateContentAsync(
            id,
            request,
            ContentStatus.Published,
            ContentStatus.Published,
            "Only published content can be updated.");
    }

    // Delete
    public async Task<ContentResponseDto> SoftDeleteAsync(int id)
    {
        var content = await _contentRepository.GetByIdTrackedAsync(id);

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
        content.UpdatedByAdminId = _currentAdminService.GetAdminId();

        await _contentRepository.SaveChangesAsync();

        return MapToResponse(content);
    }

    // Restore
    public async Task<ContentResponseDto> RestoreAsync(
        int id,
        RestoreContentRequestDto request)
    {
        var content = await _contentRepository.GetByIdTrackedAsync(id);

        if (content is null)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        if (content.Status != ContentStatus.SoftDeleted)
        {
            throw new InvalidOperationException(
                "Only soft-deleted content can be restored.");
        }

        if (content.PreviousStatus is null)
        {
            throw new InvalidOperationException(
                "Previous content status is missing.");
        }

        content.Status = content.PreviousStatus.Value;
        content.VisibilityStatus = request.VisibilityStatus;
        content.PreviousStatus = null;
        content.UpdatedAt = DateTime.UtcNow;
        content.UpdatedByAdminId = _currentAdminService.GetAdminId();

        await _contentRepository.SaveChangesAsync();

        return MapToResponse(content);
    }

    // Admin Dashboard
    public async Task<DashboardSummaryResponseDto> GetDashboardSummaryAsync()
    {
        var result = await _contentRepository.GetDashboardSummaryAsync();

        return new DashboardSummaryResponseDto
        {
            TotalCount = result.TotalCount,
            PublishedCount = result.PublishedCount,
            DraftCount = result.DraftCount,
            SoftDeletedCount = result.SoftDeletedCount,
            RecentContents = result.RecentContents
                .Select(content => new DashboardRecentContentResponseDto
                {
                    Id = content.Id,
                    Title = content.Title,
                    Category = content.Category.Name,
                    Status = content.Status,
                    UpdatedAt = content.UpdatedAt
                })
                .ToList()
        };
    }

}
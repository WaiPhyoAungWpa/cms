using Cms.Api.DTOs.Content;
using Cms.Api.DTOs.Common;
using Cms.Api.DTOs.Dashboard;
using Cms.Api.DTOs.RelatedContent;
using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services.Interfaces;
using Cms.Api.Validators;
using Cms.Api.Constants;

namespace Cms.Api.Services;

public class ContentService : IContentService
{
    // Private types
    private readonly IContentRepository _contentRepository;
    private readonly ICurrentAdminService _currentAdminService;
    private readonly IImageRepository _imageRepository;
    private readonly IImageStorageService _imageStorageService;

    private readonly IGoogleAnalyticsService _googleAnalyticsService;
    private readonly ILogger<ContentService> _logger;

    private readonly record struct SectionValidationData(
        string Title,
        string Description,
        int SectionImageId,
        string? HyperlinkName,
        string? HyperlinkUrl);

    // Constructor
    public ContentService(
        IContentRepository contentRepository,
        IImageRepository imageRepository,
        ICurrentAdminService currentAdminService,
        IImageStorageService imageStorageService,
        IGoogleAnalyticsService googleAnalyticsService,
        ILogger<ContentService> logger)
    {
        _contentRepository = contentRepository;
        _imageRepository = imageRepository;
        _currentAdminService = currentAdminService;
        _imageStorageService = imageStorageService;
        _googleAnalyticsService = googleAnalyticsService;
        _logger = logger;
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
            request.HyperlinkName,
            request.HyperlinkUrl,
            request.RelatedContentIds,
            request.Sections.Select(s =>
                new SectionValidationData(
                    s.Title,
                    s.Description,
                    s.SectionImageId,
                    s.HyperlinkName,
                    s.HyperlinkUrl))
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
            request.HyperlinkName,
            request.HyperlinkUrl,
            request.RelatedContentIds,
            request.Sections.Select(s =>
                new SectionValidationData(
                    s.Title,
                    s.Description,
                    s.SectionImageId,
                    s.HyperlinkName,
                    s.HyperlinkUrl))
        );
    }

    private static void ValidateContentFields(
        int categoryId,
        string title,
        string description,
        int coverImageId,
        string? hyperlinkName,
        string? hyperlinkUrl,
        IEnumerable<int> relatedContentIds,
        IEnumerable<SectionValidationData> sections)
    {
        if (!CategoryIds.IsValid(categoryId))
            throw new ArgumentException("Invalid category.");

        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.");

        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Description is required.");

        if (coverImageId <= 0)
            throw new ArgumentException("Cover image is required.");

        ValidateHyperlink(hyperlinkName, hyperlinkUrl);

        if (relatedContentIds.Count() != relatedContentIds.Distinct().Count())
        {
            throw new ArgumentException(
                "Duplicate related content is not allowed.");
        }

        foreach (var section in sections)
        {
            if (string.IsNullOrWhiteSpace(section.Title))
                throw new ArgumentException("Section title is required.");

            if (string.IsNullOrWhiteSpace(section.Description))
                throw new ArgumentException("Section description is required.");

            if (section.SectionImageId <= 0)
                throw new ArgumentException("Section image is required.");

            ValidateHyperlink(section.HyperlinkName, section.HyperlinkUrl);
        }
    }

    private async Task ValidateImagesBelongToCategoryAsync(
        int categoryId,
        int coverImageId,
        IEnumerable<int> sectionImageIds)
    {
        var imageIds = sectionImageIds
            .Append(coverImageId)
            .Distinct()
            .ToList();

        var images = await _imageRepository.GetByIdsAsync(imageIds);

        if (images.Count != imageIds.Count)
        {
            throw new ArgumentException(
                "One or more selected images do not exist.");
        }

        if (images.Any(image => image.CategoryId != categoryId))
        {
            throw new ArgumentException(
                "All selected images must belong to the selected category.");
        }
    }

    private static void ValidateHyperlink(
        string? hyperlinkName,
        string? hyperlinkUrl)
    {
        var hasName = !string.IsNullOrWhiteSpace(hyperlinkName);
        var hasUrl = !string.IsNullOrWhiteSpace(hyperlinkUrl);

        if (hasName != hasUrl)
        {
            throw new ArgumentException(
                "Hyperlink name and URL must both be provided.");
        }

        if (hasUrl &&
            (!Uri.TryCreate(hyperlinkUrl, UriKind.Absolute, out var uri) ||
            (uri.Scheme != Uri.UriSchemeHttp &&
            uri.Scheme != Uri.UriSchemeHttps)))
        {
            throw new ArgumentException(
                "Hyperlink URL must be a valid HTTP or HTTPS URL.");
        }
    }

    private async Task ValidateRelatedContentSelectionAsync(
        IEnumerable<int> relatedContentIds)
    {
        var ids = relatedContentIds
            .Distinct()
            .ToList();

        if (!ids.Any())
        {
            return;
        }

        if (ids.Any(id => id <= 0))
        {
            throw new ArgumentException(
                "Invalid related content.");
        }

        var validIds = await _contentRepository
            .GetValidRelatedContentIdsAsync(ids);

        if (validIds.Count != ids.Count)
        {
            throw new ArgumentException(
                "One or more selected related contents must be published and public.");
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
            HyperlinkName = content.HyperlinkName,
            HyperlinkUrl = content.HyperlinkUrl,
            RelatedContents =
                content.RelatedContents
                    .Select(r => new RelatedContentResponseDto
                    {
                        Id = r.RelatedContent.Id,
                        Title = r.RelatedContent.Title,
                        Category = r.RelatedContent.Category.Name,
                        CoverImageUrl = r.RelatedContent.CoverImage.FilePath
                    })
                    .ToList(),
            Sections = content.Sections
                .Select(section => new SectionDetailResponseDto
                {
                    Id = section.Id,
                    Title = section.Title,
                    Description = section.Description,
                    SectionImageId = section.SectionImageId,
                    ImageUrl = section.SectionImage.FilePath,
                    HyperlinkName = section.HyperlinkName,
                    HyperlinkUrl = section.HyperlinkUrl,
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
            HyperlinkName = request.HyperlinkName,
            HyperlinkUrl = request.HyperlinkUrl,

            Status = status,
            VisibilityStatus = visibilityStatus,

            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,

            CreatedByAdminId = _currentAdminService.GetAdminId(),
            UpdatedByAdminId = _currentAdminService.GetAdminId(),

            RelatedContents = request.RelatedContentIds
                .Distinct()
                .Select(id => new ContentRelationship
                {
                    RelatedContentId = id
                })
                .ToList(),

            Sections = request.Sections.Select(section => new Section
            {
                Title = section.Title,
                Description = section.Description,
                SectionImageId = section.SectionImageId,
                HyperlinkName = section.HyperlinkName,
                HyperlinkUrl = section.HyperlinkUrl,
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
        content.HyperlinkName = request.HyperlinkName;
        content.HyperlinkUrl = request.HyperlinkUrl;
        content.UpdatedAt = DateTime.UtcNow;
        content.UpdatedByAdminId = _currentAdminService.GetAdminId();

        var requestedRelatedContentIds = request.RelatedContentIds
            .Distinct()
            .ToHashSet();

        var relationshipsToRemove = content.RelatedContents
            .Where(r => !requestedRelatedContentIds.Contains(r.RelatedContentId))
            .ToList();

        foreach (var relationship in relationshipsToRemove)
        {
            content.RelatedContents.Remove(relationship);
        }

        var existingRelatedContentIds = content.RelatedContents
            .Select(r => r.RelatedContentId)
            .ToHashSet();

        foreach (var relatedContentId in requestedRelatedContentIds)
        {
            if (!existingRelatedContentIds.Contains(relatedContentId))
            {
                content.RelatedContents.Add(new ContentRelationship
                {
                    RelatedContentId = relatedContentId
                });
            }
        }

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
                existingSection.HyperlinkName = sectionRequest.HyperlinkName;
                existingSection.HyperlinkUrl = sectionRequest.HyperlinkUrl;
            }
            else
            {
                content.Sections.Add(new Section
                {
                    Title = sectionRequest.Title,
                    Description = sectionRequest.Description,
                    SectionImageId = sectionRequest.SectionImageId,
                    HyperlinkName = sectionRequest.HyperlinkName,
                    HyperlinkUrl = sectionRequest.HyperlinkUrl
                });
            }
        }
    }

    private static List<Image> GetImagesToDelete(
        Content content,
        UpdateContentRequestDto request)
    {
        var imagesToDelete = new List<Image>();

        // Cover image replaced
        if (content.CoverImageId != request.CoverImageId &&
            content.CoverImage is not null && content.CoverImage.Type == ImageType.Custom)
        {
            imagesToDelete.Add(content.CoverImage);
        }

        // Existing sections by ID
        var requestedSections = request.Sections
            .Where(section => section.Id.HasValue)
            .ToDictionary(section => section.Id!.Value);

        foreach (var section in content.Sections)
        {
            // Section removed
            if (!requestedSections.TryGetValue(section.Id, out var requestSection))
            {
                if (section.SectionImage is not null && section.SectionImage.Type == ImageType.Custom)
                {
                    imagesToDelete.Add(section.SectionImage);
                }

                continue;
            }

            // Section image replaced
            if (section.SectionImageId != requestSection.SectionImageId &&
                section.SectionImage is not null && section.SectionImage.Type == ImageType.Custom)
            {
                imagesToDelete.Add(section.SectionImage);
            }
        }

        return imagesToDelete
            .DistinctBy(image => image.Id)
            .ToList();
    }

    private async Task DeleteImagesAsync(
        IEnumerable<Image> images)
    {
        var deletedImages = new List<Image>();

        foreach (var image in images)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(image.StoragePublicId))
                {
                    await _imageStorageService.DeleteAsync(
                        image.StoragePublicId);
                }

                deletedImages.Add(image);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to delete image {ImageId}.",
                    image.Id);
            }
        }

        foreach (var image in deletedImages)
        {
            await _imageRepository.DeleteAsync(image);
        }

        await _imageRepository.SaveChangesAsync();
    }

    private static string? GetStaticPageTitle(string pagePath)
    {
        return pagePath switch
        {
            "/" => "Home",
            "/login" => "Login",
            "/admin" => "Admin Dashboard",
            "/content" => "Manage Content",
            "/content/create" => "Create Content",
            _ => null
        };
    }

    private static int? ExtractContentId(string pagePath)
    {
        var match = System.Text.RegularExpressions.Regex.Match(
            pagePath,
            @"^/(?:content|public/content)/(\d+)(?:/edit)?$");

        if (!match.Success)
        {
            return null;
        }

        return int.Parse(match.Groups[1].Value);
    }

    private static string GetDisplayTitle(
        string pagePath,
        IReadOnlyDictionary<int, string>? titles)
    {
        if (titles is null)
        {
            return pagePath;
        }
        var staticTitle = GetStaticPageTitle(pagePath);

        if (staticTitle is not null)
        {
            return staticTitle;
        }

        var contentId = ExtractContentId(pagePath);

        if (contentId is null)
        {
            return pagePath;
        }

        if (!titles.TryGetValue(contentId.Value, out var title))
        {
            return pagePath;
        }

        if (pagePath.StartsWith("/public/content/"))
        {
            return $"Public: {title}";
        }

        return $"Edit: {title}";
    }

    // Public methods
    // Create
    public async Task<ContentResponseDto> PublishAsync(CreateContentRequestDto request)
    {
        ValidateRequest(request);
        await ValidateImagesBelongToCategoryAsync(
            request.CategoryId,
            request.CoverImageId,
            request.Sections.Select(section => section.SectionImageId));

        await ValidateRelatedContentSelectionAsync(request.RelatedContentIds);

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
        await ValidateImagesBelongToCategoryAsync(
            request.CategoryId,
            request.CoverImageId,
            request.Sections.Select(section => section.SectionImageId));

        await ValidateRelatedContentSelectionAsync(request.RelatedContentIds);

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

    public async Task<PagedResponseDto<RelatedContentResponseDto>>
        GetRelatedContentOptionsAsync(
            RelatedContentQueryRequestDto request)
    {
        PaginationValidator.Validate(
            request.Page,
            request.PageSize);

        var result =
            await _contentRepository
                .GetRelatedContentOptionsAsync(request);

        var items = result.Items
            .Select(content => new RelatedContentResponseDto
            {
                Id = content.Id,
                Title = content.Title,
                Category = content.Category.Name,
                CoverImageUrl = content.CoverImage.FilePath
            })
            .ToList();

        return new PagedResponseDto<RelatedContentResponseDto>
        {
            Items = items,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = result.TotalCount,
            TotalPages = (int)Math.Ceiling(
                result.TotalCount /
                (double)request.PageSize)
        };
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
        await ValidateImagesBelongToCategoryAsync(
            request.CategoryId,
            request.CoverImageId,
            request.Sections.Select(section => section.SectionImageId));

        await ValidateRelatedContentSelectionAsync(request.RelatedContentIds);

        var content = await _contentRepository.GetByIdTrackedAsync(id);

        if (content is null)
        {
            throw new KeyNotFoundException("Content not found.");
        }

        if (content.Status != requiredStatus)
        {
            throw new InvalidOperationException(invalidStatusMessage);
        }

        if (request.RelatedContentIds.Contains(id))
        {
            throw new ArgumentException(
                "Content cannot be related to itself.");
        }

        var imagesToDelete = GetImagesToDelete(
            content,
            request);

        ApplyUpdates(content, request);

        content.Status = targetStatus;

        await _contentRepository.SaveChangesAsync();

        await DeleteImagesAsync(imagesToDelete);

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
        var analytics = await _googleAnalyticsService.GetAnalyticsSummaryAsync();

        var contentIds = analytics.PopularContents
            .Select(content => ExtractContentId(content.PagePath))
            .Where(id => id.HasValue)
            .Select(id => id!.Value)
            .Distinct()
            .ToList();

        var titles = await _contentRepository.GetTitlesByIdsAsync(contentIds);

        return new DashboardSummaryResponseDto
        {
            // CMS Database
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
                .ToList(),

            CategoryDistribution = result.CategoryDistribution,

            // Google Analytics
            TotalReaders = analytics.TotalReaders,
            TotalViews = analytics.TotalViews,

            MonthlyViews = analytics.MonthlyViews
                .Select(month => new DashboardMonthlyViewResponseDto
                {
                    Month = month.Month,
                    Views = month.Views
                })
                .ToList(),

            PopularContents = analytics.PopularContents
                .Select(content => new DashboardPopularContentResponseDto
                {
                    Title = GetDisplayTitle(
                        content.PagePath,
                        titles),

                    PagePath = content.PagePath,

                    Views = content.Views
                })
                .ToList(),

            TrafficSources = analytics.TrafficSources
                .Select(source => new DashboardTrafficSourceResponseDto
                {
                    Source = source.Source,
                    Sessions = source.Sessions
                })
                .ToList(),

            LastUpdated = DateTime.UtcNow,
            DataSource = "Google Analytics + CMS Database"
        };
    }

}
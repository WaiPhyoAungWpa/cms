using Cms.Api.DTOs.Content;
using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Cms.Api.Tests.Services;

public class ContentServiceTests
{
    private readonly Mock<IContentRepository> _contentRepository = new();
    private readonly Mock<IImageRepository> _imageRepository = new();
    private readonly Mock<ICurrentAdminService> _currentAdminService = new();

    private readonly ContentService _service;

    public ContentServiceTests()
    {
        _currentAdminService
            .Setup(x => x.GetAdminId())
            .Returns(1);

        _service = new ContentService(
            _contentRepository.Object,
            _imageRepository.Object,
            _currentAdminService.Object);
    }

    // Create
    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenRequestIsNull()
    {
        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentNullException>(
            () => _service.PublishAsync(null!));

        Assert.Equal("request", exception.ParamName);

        _contentRepository.Verify(
            x => x.AddAsync(It.IsAny<Content>()),
            Times.Never);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenCategoryMissing()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 0,
            Title = "Title",
            Description = "Description",
            CoverImageId = 1
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.PublishAsync(request));

        Assert.Equal("Invalid category.", exception.Message);

        _contentRepository.Verify(
            x => x.AddAsync(It.IsAny<Content>()),
            Times.Never);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenTitleMissing()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "",
            Description = "Description",
            CoverImageId = 1
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.PublishAsync(request));

        Assert.Equal("Title is required.", exception.Message);
    }

    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenDescriptionMissing()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "Title",
            Description = "",
            CoverImageId = 1
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.PublishAsync(request));

        Assert.Equal("Description is required.", exception.Message);
    }

    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenCoverImageMissing()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "Title",
            Description = "Description",
            CoverImageId = 0
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.PublishAsync(request));

        Assert.Equal("Cover image is required.", exception.Message);
    }

    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenSectionTitleMissing()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "Title",
            Description = "Description",
            CoverImageId = 1,
            Sections =
            [
                new CreateSectionRequestDto
                {
                    Title = "",
                    Description = "Section Description",
                    SectionImageId = 2
                }
            ]
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.PublishAsync(request));

        Assert.Equal("Section title is required.", exception.Message);
    }

    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenSectionDescriptionMissing()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "Title",
            Description = "Description",
            CoverImageId = 1,
            Sections =
            [
                new CreateSectionRequestDto
                {
                    Title = "Section Title",
                    Description = "",
                    SectionImageId = 2
                }
            ]
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.PublishAsync(request));

        Assert.Equal("Section description is required.", exception.Message);
    }

    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenSectionImageMissing()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "Title",
            Description = "Description",
            CoverImageId = 1,
            Sections =
            [
                new CreateSectionRequestDto
                {
                    Title = "Section Title",
                    Description = "Section Description",
                    SectionImageId = 0
                }
            ]
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.PublishAsync(request));

        Assert.Equal("Section image is required.", exception.Message);
    }

    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenImageDoesNotExist()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "Title",
            Description = "Description",
            CoverImageId = 1,
            Sections =
            [
                new CreateSectionRequestDto
                {
                    Title = "Section Title",
                    Description = "Section Description",
                    SectionImageId = 2
                }
            ]
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(new List<Image>());

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.PublishAsync(request));

        Assert.Equal(
            "One or more selected images do not exist.",
            exception.Message);

        _contentRepository.Verify(
            x => x.AddAsync(It.IsAny<Content>()),
            Times.Never);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task PublishAsync_ShouldThrow_WhenImageBelongsToDifferentCategory()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "Title",
            Description = "Description",
            CoverImageId = 1,
            Sections =
            [
                new CreateSectionRequestDto
                {
                    Title = "Section Title",
                    Description = "Section Description",
                    SectionImageId = 2
                }
            ]
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image
                {
                    Id = 1,
                    CategoryId = 1
                },
                new Image
                {
                    Id = 2,
                    CategoryId = 2
                }
            ]);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.PublishAsync(request));

        Assert.Equal(
            "All selected images must belong to the selected category.",
            exception.Message);

        _contentRepository.Verify(
            x => x.AddAsync(It.IsAny<Content>()),
            Times.Never);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task PublishAsync_ShouldCreatePublishedContent()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "My Title",
            Description = "My Description",
            CoverImageId = 1,
            Sections =
            [
                new CreateSectionRequestDto
                {
                    Title = "Section 1",
                    Description = "Section Description",
                    SectionImageId = 2
                }
            ]
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image
                {
                    Id = 1,
                    CategoryId = 1
                },
                new Image
                {
                    Id = 2,
                    CategoryId = 1
                }
            ]);

        Content? createdContent = null;

        _contentRepository
            .Setup(x => x.AddAsync(It.IsAny<Content>()))
            .Callback<Content>(content => createdContent = content)
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.PublishAsync(request);

        // Assert
        Assert.NotNull(createdContent);

        Assert.Equal(ContentStatus.Published, createdContent!.Status);
        Assert.Equal(VisibilityStatus.Public, createdContent.VisibilityStatus);

        Assert.Equal(request.CategoryId, createdContent.CategoryId);
        Assert.Equal(request.Title, createdContent.Title);
        Assert.Equal(request.Description, createdContent.Description);
        Assert.Equal(request.CoverImageId, createdContent.CoverImageId);

        Assert.Equal(1, createdContent.CreatedByAdminId);
        Assert.Equal(1, createdContent.UpdatedByAdminId);

        Assert.Single(createdContent.Sections);

        var section = createdContent.Sections.Single();

        Assert.Equal("Section 1", section.Title);
        Assert.Equal("Section Description", section.Description);
        Assert.Equal(2, section.SectionImageId);

        _contentRepository.Verify(
            x => x.AddAsync(It.IsAny<Content>()),
            Times.Once);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Once);

        Assert.Equal("My Title", result.Title);
        Assert.Equal("Published", result.Status);
        Assert.Equal("Public", result.VisibilityStatus);
    }

    [Fact]
    public async Task SaveDraftAsync_ShouldCreateDraftContent()
    {
        // Arrange
        var request = new CreateContentRequestDto
        {
            CategoryId = 1,
            Title = "My Draft",
            Description = "Draft Description",
            CoverImageId = 1,
            Sections =
            [
                new CreateSectionRequestDto
                {
                    Title = "Draft Section",
                    Description = "Draft Section Description",
                    SectionImageId = 2
                }
            ]
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image
                {
                    Id = 1,
                    CategoryId = 1
                },
                new Image
                {
                    Id = 2,
                    CategoryId = 1
                }
            ]);

        Content? createdContent = null;

        _contentRepository
            .Setup(x => x.AddAsync(It.IsAny<Content>()))
            .Callback<Content>(content => createdContent = content)
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.SaveDraftAsync(request);

        // Assert
        Assert.NotNull(createdContent);

        Assert.Equal(ContentStatus.Draft, createdContent!.Status);
        Assert.Equal(VisibilityStatus.Private, createdContent.VisibilityStatus);

        Assert.Equal(request.CategoryId, createdContent.CategoryId);
        Assert.Equal(request.Title, createdContent.Title);
        Assert.Equal(request.Description, createdContent.Description);
        Assert.Equal(request.CoverImageId, createdContent.CoverImageId);

        Assert.Equal(1, createdContent.CreatedByAdminId);
        Assert.Equal(1, createdContent.UpdatedByAdminId);

        Assert.Single(createdContent.Sections);

        var section = createdContent.Sections.Single();

        Assert.Equal("Draft Section", section.Title);
        Assert.Equal("Draft Section Description", section.Description);
        Assert.Equal(2, section.SectionImageId);

        _contentRepository.Verify(
            x => x.AddAsync(It.IsAny<Content>()),
            Times.Once);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Once);

        Assert.Equal("My Draft", result.Title);
        Assert.Equal("Draft", result.Status);
        Assert.Equal("Private", result.VisibilityStatus);
    }

    // Read All
    [Fact]
    public async Task GetAllAsync_ShouldReturnPagedResponse()
    {
        // Arrange
        var request = new ContentQueryRequestDto
        {
            Page = 1,
            PageSize = 10
        };

        var contents = new List<Content>
        {
            new()
            {
                Id = 1,
                Title = "First Content",
                Status = ContentStatus.Published,
                VisibilityStatus = VisibilityStatus.Public,
                Category = new Category
                {
                    Name = "Experience"
                }
            },
            new()
            {
                Id = 2,
                Title = "Second Content",
                Status = ContentStatus.Draft,
                VisibilityStatus = VisibilityStatus.Private,
                Category = new Category
                {
                    Name = "Learning"
                }
            }
        };

        _contentRepository
            .Setup(x => x.GetAllAsync(request))
            .ReturnsAsync((contents, 2));

        // Act
        var result = await _service.GetAllAsync(request);

        // Assert
        Assert.Equal(2, result.TotalCount);
        Assert.Equal(1, result.Page);
        Assert.Equal(10, result.PageSize);
        Assert.Equal(1, result.TotalPages);

        Assert.Equal(2, result.Items.Count);

        var first = result.Items[0];
        Assert.Equal(1, first.Id);
        Assert.Equal("First Content", first.Title);
        Assert.Equal("Experience", first.Category);
        Assert.Equal(ContentStatus.Published, first.Status);
        Assert.Equal(VisibilityStatus.Public, first.VisibilityStatus);

        var second = result.Items[1];
        Assert.Equal(2, second.Id);
        Assert.Equal("Second Content", second.Title);
        Assert.Equal("Learning", second.Category);
        Assert.Equal(ContentStatus.Draft, second.Status);
        Assert.Equal(VisibilityStatus.Private, second.VisibilityStatus);

        _contentRepository.Verify(
            x => x.GetAllAsync(request),
            Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmptyResult()
    {
        // Arrange
        var request = new ContentQueryRequestDto
        {
            Page = 1,
            PageSize = 10
        };

        _contentRepository
            .Setup(x => x.GetAllAsync(request))
            .ReturnsAsync((new List<Content>(), 0));

        // Act
        var result = await _service.GetAllAsync(request);

        // Assert
        Assert.Empty(result.Items);

        Assert.Equal(0, result.TotalCount);
        Assert.Equal(1, result.Page);
        Assert.Equal(10, result.PageSize);
        Assert.Equal(0, result.TotalPages);

        _contentRepository.Verify(
            x => x.GetAllAsync(request),
            Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_ShouldThrow_WhenPageIsLessThanOne()
    {
        // Arrange
        var request = new ContentQueryRequestDto
        {
            Page = 0,
            PageSize = 10
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.GetAllAsync(request));

        Assert.Equal("Page must be greater than or equal to 1.", exception.Message);

        _contentRepository.Verify(
            x => x.GetAllAsync(It.IsAny<ContentQueryRequestDto>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAllAsync_ShouldThrow_WhenPageSizeIsLessThanOne()
    {
        // Arrange
        var request = new ContentQueryRequestDto
        {
            Page = 1,
            PageSize = 0
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _service.GetAllAsync(request));

        Assert.Equal("Page size must be greater than or equal to 1.", exception.Message);

        _contentRepository.Verify(
            x => x.GetAllAsync(It.IsAny<ContentQueryRequestDto>()),
            Times.Never);
    }

    // Read by ID
    [Fact]
    public async Task GetByIdAsync_ShouldReturnContent()
    {
        // Arrange
        var content = new Content
        {
            Id = 1,
            CategoryId = 1,
            Category = new Category
            {
                Name = "Experience"
            },
            Title = "My Title",
            Description = "My Description",
            Status = ContentStatus.Published,
            VisibilityStatus = VisibilityStatus.Public,
            CoverImageId = 1,
            CoverImage = new Image
            {
                FilePath = "/images/cover.jpg"
            },
            Sections =
            [
                new Section
                {
                    Id = 1,
                    Title = "Section 1",
                    Description = "Section Description",
                    SectionImageId = 2,
                    SectionImage = new Image
                    {
                        FilePath = "/images/section.jpg"
                    }
                }
            ]
        };

        _contentRepository
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(content);

        // Act
        var result = await _service.GetByIdAsync(1);

        // Assert
        Assert.Equal(1, result.Id);
        Assert.Equal(1, result.CategoryId);
        Assert.Equal("Experience", result.Category);

        Assert.Equal("My Title", result.Title);
        Assert.Equal("My Description", result.Description);

        Assert.Equal(ContentStatus.Published, result.Status);
        Assert.Equal(VisibilityStatus.Public, result.VisibilityStatus);

        Assert.Equal(1, result.CoverImageId);
        Assert.Equal("/images/cover.jpg", result.CoverImageUrl);

        Assert.Single(result.Sections);

        var section = result.Sections.Single();

        Assert.Equal(1, section.Id);
        Assert.Equal("Section 1", section.Title);
        Assert.Equal("Section Description", section.Description);
        Assert.Equal(2, section.SectionImageId);
        Assert.Equal("/images/section.jpg", section.ImageUrl);

        _contentRepository.Verify(
            x => x.GetByIdAsync(1),
            Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldThrow_WhenContentNotFound()
    {
        // Arrange
        _contentRepository
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync((Content?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _service.GetByIdAsync(1));

        Assert.Equal("Content not found.", exception.Message);

        _contentRepository.Verify(
            x => x.GetByIdAsync(1),
            Times.Once);
    }

    // Update
    [Fact]
    public async Task UpdateDraftAsync_ShouldUpdateDraft()
    {
        // Arrange
        var request = new UpdateContentRequestDto
        {
            CategoryId = 1,
            VisibilityStatus = VisibilityStatus.Private,
            Title = "Updated Title",
            Description = "Updated Description",
            CoverImageId = 1,
            Sections =
            [
                new UpdateSectionRequestDto
                {
                    Id = 1,
                    Title = "Updated Section",
                    Description = "Updated Section Description",
                    SectionImageId = 2
                }
            ]
        };

        var content = new Content
        {
            Id = 1,
            CategoryId = 1,
            Title = "Old Title",
            Description = "Old Description",
            CoverImageId = 1,
            Status = ContentStatus.Draft,
            VisibilityStatus = VisibilityStatus.Private,
            Sections =
            [
                new Section
                {
                    Id = 1,
                    Title = "Old Section",
                    Description = "Old Section Description",
                    SectionImageId = 2
                }
            ]
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image { Id = 1, CategoryId = 1 },
                new Image { Id = 2, CategoryId = 1 }
            ]);

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(content);

        // Act
        var result = await _service.UpdateDraftAsync(1, request);

        // Assert
        Assert.Equal("Updated Title", content.Title);
        Assert.Equal("Updated Description", content.Description);

        Assert.Equal(ContentStatus.Draft, content.Status);
        Assert.Equal(VisibilityStatus.Private, content.VisibilityStatus);

        var section = content.Sections.Single();

        Assert.Equal("Updated Section", section.Title);
        Assert.Equal("Updated Section Description", section.Description);
        Assert.Equal(2, section.SectionImageId);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Once);

        Assert.Equal("Updated Title", result.Title);
        Assert.Equal("Draft", result.Status);
        Assert.Equal("Private", result.VisibilityStatus);
    }

    [Fact]
    public async Task PublishDraftAsync_ShouldPublishDraft()
    {
        // Arrange
        var request = new UpdateContentRequestDto
        {
            CategoryId = 1,
            VisibilityStatus = VisibilityStatus.Public,
            Title = "Published Title",
            Description = "Published Description",
            CoverImageId = 1,
            Sections =
            [
                new UpdateSectionRequestDto
                {
                    Id = 1,
                    Title = "Published Section",
                    Description = "Published Section Description",
                    SectionImageId = 2
                }
            ]
        };

        var content = new Content
        {
            Id = 1,
            CategoryId = 1,
            Title = "Draft Title",
            Description = "Draft Description",
            CoverImageId = 1,
            Status = ContentStatus.Draft,
            VisibilityStatus = VisibilityStatus.Private,
            Sections =
            [
                new Section
                {
                    Id = 1,
                    Title = "Draft Section",
                    Description = "Draft Section Description",
                    SectionImageId = 2
                }
            ]
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image { Id = 1, CategoryId = 1 },
                new Image { Id = 2, CategoryId = 1 }
            ]);

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(content);

        // Act
        var result = await _service.PublishDraftAsync(1, request);

        // Assert
        Assert.Equal("Published Title", content.Title);
        Assert.Equal("Published Description", content.Description);

        Assert.Equal(ContentStatus.Published, content.Status);
        Assert.Equal(VisibilityStatus.Public, content.VisibilityStatus);

        var section = content.Sections.Single();

        Assert.Equal("Published Section", section.Title);
        Assert.Equal("Published Section Description", section.Description);
        Assert.Equal(2, section.SectionImageId);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Once);

        Assert.Equal("Published Title", result.Title);
        Assert.Equal("Published", result.Status);
        Assert.Equal("Public", result.VisibilityStatus);
    }

    [Fact]
    public async Task UpdatePublishedAsync_ShouldUpdatePublished()
    {
        // Arrange
        var request = new UpdateContentRequestDto
        {
            CategoryId = 1,
            VisibilityStatus = VisibilityStatus.Private,
            Title = "Updated Published Title",
            Description = "Updated Published Description",
            CoverImageId = 1,
            Sections =
            [
                new UpdateSectionRequestDto
                {
                    Id = 1,
                    Title = "Updated Section",
                    Description = "Updated Section Description",
                    SectionImageId = 2
                }
            ]
        };

        var content = new Content
        {
            Id = 1,
            CategoryId = 1,
            Title = "Original Title",
            Description = "Original Description",
            CoverImageId = 1,
            Status = ContentStatus.Published,
            VisibilityStatus = VisibilityStatus.Public,
            Sections =
            [
                new Section
                {
                    Id = 1,
                    Title = "Original Section",
                    Description = "Original Section Description",
                    SectionImageId = 2
                }
            ]
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image { Id = 1, CategoryId = 1 },
                new Image { Id = 2, CategoryId = 1 }
            ]);

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(content);

        // Act
        var result = await _service.UpdatePublishedAsync(1, request);

        // Assert
        Assert.Equal("Updated Published Title", content.Title);
        Assert.Equal("Updated Published Description", content.Description);

        Assert.Equal(ContentStatus.Published, content.Status);
        Assert.Equal(VisibilityStatus.Private, content.VisibilityStatus);

        var section = content.Sections.Single();

        Assert.Equal("Updated Section", section.Title);
        Assert.Equal("Updated Section Description", section.Description);
        Assert.Equal(2, section.SectionImageId);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Once);

        Assert.Equal("Updated Published Title", result.Title);
        Assert.Equal("Published", result.Status);
        Assert.Equal("Private", result.VisibilityStatus);
    }

    [Fact]
    public async Task UpdateDraftAsync_ShouldThrow_WhenContentNotFound()
    {
        // Arrange
        var request = new UpdateContentRequestDto
        {
            CategoryId = 1,
            VisibilityStatus = VisibilityStatus.Private,
            Title = "Updated Title",
            Description = "Updated Description",
            CoverImageId = 1
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image { Id = 1, CategoryId = 1 }
            ]);

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync((Content?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _service.UpdateDraftAsync(1, request));

        Assert.Equal("Content not found.", exception.Message);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task UpdateDraftAsync_ShouldThrow_WhenStatusIsNotDraft()
    {
        // Arrange
        var request = new UpdateContentRequestDto
        {
            CategoryId = 1,
            VisibilityStatus = VisibilityStatus.Private,
            Title = "Updated Title",
            Description = "Updated Description",
            CoverImageId = 1
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image { Id = 1, CategoryId = 1 }
            ]);

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(new Content
            {
                Id = 1,
                Status = ContentStatus.Published,
                Sections = []
            });

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.UpdateDraftAsync(1, request));

        Assert.Equal(
            "Only draft content can be saved as draft.",
            exception.Message);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task PublishDraftAsync_ShouldThrow_WhenStatusIsNotDraft()
    {
        // Arrange
        var request = new UpdateContentRequestDto
        {
            CategoryId = 1,
            VisibilityStatus = VisibilityStatus.Public,
            Title = "Updated Title",
            Description = "Updated Description",
            CoverImageId = 1
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image { Id = 1, CategoryId = 1 }
            ]);

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(new Content
            {
                Id = 1,
                Status = ContentStatus.Published,
                Sections = []
            });

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.PublishDraftAsync(1, request));

        Assert.Equal(
            "Only draft content can be published.",
            exception.Message);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task UpdatePublishedAsync_ShouldThrow_WhenStatusIsNotPublished()
    {
        // Arrange
        var request = new UpdateContentRequestDto
        {
            CategoryId = 1,
            VisibilityStatus = VisibilityStatus.Private,
            Title = "Updated Title",
            Description = "Updated Description",
            CoverImageId = 1
        };

        _imageRepository
            .Setup(x => x.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync(
            [
                new Image { Id = 1, CategoryId = 1 }
            ]);

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(new Content
            {
                Id = 1,
                Status = ContentStatus.Draft,
                Sections = []
            });

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.UpdatePublishedAsync(1, request));

        Assert.Equal(
            "Only published content can be updated.",
            exception.Message);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    // Delete
    [Fact]
    public async Task SoftDeleteAsync_ShouldSoftDeleteContent()
    {
        // Arrange
        var content = new Content
        {
            Id = 1,
            Status = ContentStatus.Published,
            PreviousStatus = null,
            UpdatedByAdminId = 0
        };

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(content);

        // Act
        var result = await _service.SoftDeleteAsync(1);

        // Assert
        Assert.Equal(ContentStatus.SoftDeleted, content.Status);
        Assert.Equal(ContentStatus.Published, content.PreviousStatus);

        Assert.Equal(1, content.UpdatedByAdminId);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Once);

        Assert.Equal("SoftDeleted", result.Status);
    }

    [Fact]
    public async Task SoftDeleteAsync_ShouldThrow_WhenContentNotFound()
    {
        // Arrange
        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync((Content?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _service.SoftDeleteAsync(1));

        Assert.Equal("Content not found.", exception.Message);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task SoftDeleteAsync_ShouldThrow_WhenContentCannotBeDeleted()
    {
        // Arrange
        var content = new Content
        {
            Id = 1,
            Status = ContentStatus.SoftDeleted
        };

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(content);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.SoftDeleteAsync(1));

        Assert.Equal(
            "Only draft or published content can be deleted.",
            exception.Message);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    // Restore
    [Fact]
    public async Task RestoreAsync_ShouldRestoreContent()
    {
        // Arrange
        var request = new RestoreContentRequestDto
        {
            VisibilityStatus = VisibilityStatus.Public
        };

        var content = new Content
        {
            Id = 1,
            Status = ContentStatus.SoftDeleted,
            PreviousStatus = ContentStatus.Draft,
            VisibilityStatus = VisibilityStatus.Private
        };

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(content);

        // Act
        var result = await _service.RestoreAsync(1, request);

        // Assert
        Assert.Equal(ContentStatus.Draft, content.Status);
        Assert.Null(content.PreviousStatus);
        Assert.Equal(VisibilityStatus.Public, content.VisibilityStatus);
        Assert.Equal(1, content.UpdatedByAdminId);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Once);

        Assert.Equal("Draft", result.Status);
        Assert.Equal("Public", result.VisibilityStatus);
    }

    [Fact]
    public async Task RestoreAsync_ShouldThrow_WhenContentNotFound()
    {
        // Arrange
        var request = new RestoreContentRequestDto
        {
            VisibilityStatus = VisibilityStatus.Public
        };

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync((Content?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _service.RestoreAsync(1, request));

        Assert.Equal("Content not found.", exception.Message);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task RestoreAsync_ShouldThrow_WhenContentIsNotSoftDeleted()
    {
        // Arrange
        var request = new RestoreContentRequestDto
        {
            VisibilityStatus = VisibilityStatus.Public
        };

        var content = new Content
        {
            Id = 1,
            Status = ContentStatus.Published
        };

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(content);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.RestoreAsync(1, request));

        Assert.Equal(
            "Only soft-deleted content can be restored.",
            exception.Message);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    [Fact]
    public async Task RestoreAsync_ShouldThrow_WhenPreviousStatusIsMissing()
    {
        // Arrange
        var request = new RestoreContentRequestDto
        {
            VisibilityStatus = VisibilityStatus.Public
        };

        var content = new Content
        {
            Id = 1,
            Status = ContentStatus.SoftDeleted,
            PreviousStatus = null
        };

        _contentRepository
            .Setup(x => x.GetByIdTrackedAsync(1))
            .ReturnsAsync(content);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.RestoreAsync(1, request));

        Assert.Equal(
            "Previous content status is missing.",
            exception.Message);

        _contentRepository.Verify(
            x => x.SaveChangesAsync(),
            Times.Never);
    }

    // Admin Dashboard
    [Fact]
    public async Task GetDashboardSummaryAsync_ShouldReturnSummary()
    {
        // Arrange
        var recentContents = new List<Content>
        {
            new()
            {
                Id = 1,
                Title = "First Content",
                Status = ContentStatus.Published,
                UpdatedAt = new DateTime(2026, 7, 13),
                Category = new Category
                {
                    Name = "Experience"
                }
            },
            new()
            {
                Id = 2,
                Title = "Second Content",
                Status = ContentStatus.Draft,
                UpdatedAt = new DateTime(2026, 7, 12),
                Category = new Category
                {
                    Name = "Learning"
                }
            }
        };

        _contentRepository
            .Setup(x => x.GetDashboardSummaryAsync())
            .ReturnsAsync((
                TotalCount: 10,
                PublishedCount: 5,
                DraftCount: 3,
                SoftDeletedCount: 2,
                RecentContents: recentContents
            ));

        // Act
        var result = await _service.GetDashboardSummaryAsync();

        // Assert
        Assert.Equal(10, result.TotalCount);
        Assert.Equal(5, result.PublishedCount);
        Assert.Equal(3, result.DraftCount);
        Assert.Equal(2, result.SoftDeletedCount);

        Assert.Equal(2, result.RecentContents.Count);

        var first = result.RecentContents[0];

        Assert.Equal(1, first.Id);
        Assert.Equal("First Content", first.Title);
        Assert.Equal("Experience", first.Category);
        Assert.Equal(ContentStatus.Published, first.Status);
        Assert.Equal(new DateTime(2026, 7, 13), first.UpdatedAt);

        var second = result.RecentContents[1];

        Assert.Equal(2, second.Id);
        Assert.Equal("Second Content", second.Title);
        Assert.Equal("Learning", second.Category);
        Assert.Equal(ContentStatus.Draft, second.Status);
        Assert.Equal(new DateTime(2026, 7, 12), second.UpdatedAt);

        _contentRepository.Verify(
            x => x.GetDashboardSummaryAsync(),
            Times.Once);
    }

    [Fact]
    public async Task GetDashboardSummaryAsync_ShouldReturnEmptyRecentContents()
    {
        // Arrange
        _contentRepository
            .Setup(x => x.GetDashboardSummaryAsync())
            .ReturnsAsync((
                TotalCount: 0,
                PublishedCount: 0,
                DraftCount: 0,
                SoftDeletedCount: 0,
                RecentContents: new List<Content>()
            ));

        // Act
        var result = await _service.GetDashboardSummaryAsync();

        // Assert
        Assert.Equal(0, result.TotalCount);
        Assert.Equal(0, result.PublishedCount);
        Assert.Equal(0, result.DraftCount);
        Assert.Equal(0, result.SoftDeletedCount);

        Assert.Empty(result.RecentContents);

        _contentRepository.Verify(
            x => x.GetDashboardSummaryAsync(),
            Times.Once);
    }
}
using Cms.Api.Configurations;
using Cms.Api.Constants;
using Cms.Api.Entities;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;

namespace Cms.Api.Tests.Services;

/// <summary>
/// Verifies image upload validation, persistence, and storage cleanup behavior.
/// </summary>
public class ImageServiceTests
{
    [Fact]
    public async Task UploadAsync_DeletesStoredImage_WhenDatabaseSaveFails()
    {
        // Arrange
        var imageRepositoryMock = new Mock<IImageRepository>();
        var imageStorageServiceMock = new Mock<IImageStorageService>();

        var settings = new ImageUploadSettings
        {
            MaxFileSize = 5 * 1024 * 1024,
            AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"],
            AllowedContentTypes = ["image/jpeg", "image/png", "image/webp"]
        };

        var service = new ImageService(
            imageRepositoryMock.Object,
            imageStorageServiceMock.Object,
            Options.Create(settings),
            NullLogger<ImageService>.Instance);

        await using var stream = new MemoryStream(
            [0xFF, 0xD8, 0xFF, 0xE0]);

        var file = new FormFile(
            stream,
            0,
            stream.Length,
            "file",
            "photo.jpg")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/jpeg"
        };

        var storedImage = new StoredImage(
            "https://example.com/image.jpg",
            "cms/experience/photo");

        imageStorageServiceMock
            .Setup(storage => storage.SaveAsync(
                It.IsAny<IFormFile>(),
                It.IsAny<string>()))
            .ReturnsAsync(storedImage);

        imageRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ThrowsAsync(new InvalidOperationException("Database save failed."));

        // Act and Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.UploadAsync(file, CategoryIds.Experience));

        imageStorageServiceMock.Verify(
            storage => storage.DeleteAsync(storedImage.PublicId),
            Times.Once);
    }

    [Fact]
    public async Task UploadAsync_PersistsStoragePublicId_WhenDatabaseSaveSucceeds()
    {
        // Arrange
        var imageRepositoryMock = new Mock<IImageRepository>();
        var imageStorageServiceMock = new Mock<IImageStorageService>();

        var settings = new ImageUploadSettings
        {
            MaxFileSize = 5 * 1024 * 1024,
            AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"],
            AllowedContentTypes = ["image/jpeg", "image/png", "image/webp"]
        };

        var service = new ImageService(
            imageRepositoryMock.Object,
            imageStorageServiceMock.Object,
            Options.Create(settings),
            NullLogger<ImageService>.Instance);

        await using var stream = new MemoryStream(
            [0xFF, 0xD8, 0xFF, 0xE0]);

        var file = new FormFile(
            stream,
            0,
            stream.Length,
            "file",
            "photo.jpg")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/jpeg"
        };

        var storedImage = new StoredImage(
            "https://example.com/image.jpg",
            "cms/experience/photo");

        Image? savedImage = null;

        imageStorageServiceMock
            .Setup(storage => storage.SaveAsync(
                It.IsAny<IFormFile>(),
                It.IsAny<string>()))
            .ReturnsAsync(storedImage);

        imageRepositoryMock
            .Setup(repository => repository.AddAsync(It.IsAny<Image>()))
            .Callback<Image>(image => savedImage = image)
            .Returns(Task.CompletedTask);

        imageRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .Returns(Task.CompletedTask);

        // Act
        var result = await service.UploadAsync(
            file,
            CategoryIds.Experience);

        // Assert
        Assert.NotNull(savedImage);
        Assert.Equal(storedImage.PublicId, savedImage.StoragePublicId);
        Assert.Equal(storedImage.Url, savedImage.FilePath);

        Assert.Equal(storedImage.Url, result.FilePath);

        imageRepositoryMock.Verify(
            repository => repository.SaveChangesAsync(),
            Times.Once);

        imageStorageServiceMock.Verify(
            storage => storage.DeleteAsync(It.IsAny<string>()),
            Times.Never);
    }
}
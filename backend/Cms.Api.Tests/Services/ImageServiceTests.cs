using Cms.Api.Configurations;
using Cms.Api.Constants;
using Cms.Api.Entities;
using Cms.Api.Repositories.Interfaces;
using Cms.Api.Services;
using Cms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Moq;
using ImageMagick;

namespace Cms.Api.Tests.Services;

/// <summary>
/// Verifies image upload validation, persistence, and storage cleanup behavior.
/// </summary>
public class ImageServiceTests
{
    // Helpers
    private static (IFormFile File, MemoryStream Stream) CreateImageFile(
        MagickFormat format,
        string fileName,
        string contentType)
    {
        var stream = new MemoryStream();

        using (var image = new MagickImage(MagickColors.White, 1, 1))
        {
            image.Format = format;
            image.Write(stream);
        }

        stream.Position = 0;

        var file = new FormFile(
            stream,
            0,
            stream.Length,
            "file",
            fileName)
        {
            Headers = new HeaderDictionary(),
            ContentType = contentType
        };

        return (file, stream);
    }

    private static MemoryStream CreateValidImageStream(
        MagickFormat format)
    {
        var stream = new MemoryStream();

        using var image = new MagickImage(
            MagickColors.White,
            1,
            1);

        image.Write(stream, format);
        stream.Position = 0;

        return stream;
    }

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

        await using var stream = CreateValidImageStream(MagickFormat.Jpeg);

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

        await using var stream = CreateValidImageStream(MagickFormat.Jpeg);

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

    [Fact]
    public async Task UploadAsync_RejectsImage_WhenDecodedFormatDoesNotMatchExtension()
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

        await using var stream = CreateValidImageStream(MagickFormat.Jpeg);

        var file = new FormFile(
            stream,
            0,
            stream.Length,
            "file",
            "photo.png")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/png"
        };

        // Act and Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => service.UploadAsync(file, CategoryIds.Experience));

        imageStorageServiceMock.Verify(
            storage => storage.SaveAsync(
                It.IsAny<IFormFile>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task UploadAsync_RejectsImage_WhenContentTypeDoesNotMatchExtension()
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

        await using var stream = CreateValidImageStream(MagickFormat.Jpeg);

        var file = new FormFile(
            stream,
            0,
            stream.Length,
            "file",
            "photo.jpg")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/png"
        };

        // Act and Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => service.UploadAsync(file, CategoryIds.Experience));

        imageStorageServiceMock.Verify(
            storage => storage.SaveAsync(
                It.IsAny<IFormFile>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task UploadAsync_RejectsTruncatedImageWithValidJpegHeader()
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

        // Act and Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => service.UploadAsync(file, CategoryIds.Experience));

        imageStorageServiceMock.Verify(
            storage => storage.SaveAsync(
                It.IsAny<IFormFile>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Theory]
    [InlineData(MagickFormat.Png, ".png", "image/png")]
    [InlineData(MagickFormat.WebP, ".webp", "image/webp")]
    public async Task UploadAsync_AcceptsSupportedDecodedImageFormat(
        MagickFormat format,
        string extension,
        string contentType)
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

        await using var stream = CreateValidImageStream(format);

        var file = new FormFile(
            stream,
            0,
            stream.Length,
            "file",
            $"photo{extension}")
        {
            Headers = new HeaderDictionary(),
            ContentType = contentType
        };

        imageStorageServiceMock
            .Setup(storage => storage.SaveAsync(
                It.IsAny<IFormFile>(),
                It.IsAny<string>()))
            .ReturnsAsync(new StoredImage(
                $"https://example.com/photo{extension}",
                "cms/experience/photo"));

        imageRepositoryMock
            .Setup(repository => repository.AddAsync(It.IsAny<Image>()))
            .Returns(Task.CompletedTask);

        imageRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .Returns(Task.CompletedTask);

        // Act
        await service.UploadAsync(file, CategoryIds.Experience);

        // Assert
        imageStorageServiceMock.Verify(
            storage => storage.SaveAsync(
                It.IsAny<IFormFile>(),
                It.IsAny<string>()),
            Times.Once);
    }

    [Fact]
    public async Task UploadAsync_PreservesDatabaseExceptionAndLogs_WhenCleanupFails()
    {
        // Arrange
        var imageRepositoryMock = new Mock<IImageRepository>();
        var imageStorageServiceMock = new Mock<IImageStorageService>();
        var loggerMock = new Mock<ILogger<ImageService>>();

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
            loggerMock.Object);

        await using var stream = CreateValidImageStream(MagickFormat.Jpeg);

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

        var databaseException =
            new InvalidOperationException("Database save failed.");

        var cleanupException =
            new InvalidOperationException("Cloudinary deletion failed.");

        imageStorageServiceMock
            .Setup(storage => storage.SaveAsync(
                It.IsAny<IFormFile>(),
                It.IsAny<string>()))
            .ReturnsAsync(storedImage);

        imageRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ThrowsAsync(databaseException);

        imageStorageServiceMock
            .Setup(storage => storage.DeleteAsync(storedImage.PublicId))
            .ThrowsAsync(cleanupException);

        // Act
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.UploadAsync(file, CategoryIds.Experience));

        // Assert
        Assert.Same(databaseException, exception);

        imageStorageServiceMock.Verify(
            storage => storage.DeleteAsync(storedImage.PublicId),
            Times.Once);

        loggerMock.Verify(
            logger => logger.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((state, _) =>
                    state.ToString()!.Contains(
                        "Failed to delete orphaned stored image")),
                cleanupException,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
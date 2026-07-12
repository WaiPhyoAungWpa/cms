using Cms.Api.Entities;
using Cms.Api.Entities.Enums;
using Cms.Api.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cms.Api.Data.Configurations;

public class ImageConfiguration : IEntityTypeConfiguration<Image>
{
    public void Configure(EntityTypeBuilder<Image> builder)
    {
        builder.HasKey(image => image.Id);

        builder.Property(image => image.FilePath)
            .IsRequired()
            .HasMaxLength(EntityFieldLengths.ImageFilePath);

        builder.Property(image => image.Type)
            .IsRequired()
            .HasConversion<string>();

        builder.HasOne(image => image.Category)
            .WithMany(category => category.Images)
            .HasForeignKey(image => image.CategoryId);

        builder.HasData(
            new Image
            {
                Id = 1,
                FilePath = "/images/defaults/experience-1.png",
                Type = ImageType.Default,
                CategoryId = 1
            },
            new Image
            {
                Id = 2,
                FilePath = "/images/defaults/experience-2.png",
                Type = ImageType.Default,
                CategoryId = 1
            },
            new Image
            {
                Id = 3,
                FilePath = "/images/defaults/experience-3.png",
                Type = ImageType.Default,
                CategoryId = 1
            },
            new Image
            {
                Id = 4,
                FilePath = "/images/defaults/learning-1.png",
                Type = ImageType.Default,
                CategoryId = 2
            },
            new Image
            {
                Id = 5,
                FilePath = "/images/defaults/learning-2.png",
                Type = ImageType.Default,
                CategoryId = 2
            },
            new Image
            {
                Id = 6,
                FilePath = "/images/defaults/learning-3.png",
                Type = ImageType.Default,
                CategoryId = 2
            },
            new Image
            {
                Id = 7,
                FilePath = "/images/defaults/lifestyle-1.png",
                Type = ImageType.Default,
                CategoryId = 3
            },
            new Image
            {
                Id = 8,
                FilePath = "/images/defaults/lifestyle-2.png",
                Type = ImageType.Default,
                CategoryId = 3
            },
            new Image
            {
                Id = 9,
                FilePath = "/images/defaults/lifestyle-3.png",
                Type = ImageType.Default,
                CategoryId = 3
            }
        );
    }
}

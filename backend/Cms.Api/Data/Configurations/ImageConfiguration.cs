using Cms.Api.Entities;
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
            .HasMaxLength(255);

        builder.Property(image => image.Type)
            .HasConversion<string>();

        builder.HasOne(image => image.Category)
            .WithMany(category => category.Images)
            .HasForeignKey(image => image.CategoryId);   
    }
}

using Cms.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cms.Api.Data.Configurations;

public class ContentConfiguration : IEntityTypeConfiguration<Content>
{
    public void Configure(EntityTypeBuilder<Content> builder)
    {
        builder.HasKey(content => content.Id);

        builder.Property(content => content.Title)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(content => content.Description)
            .IsRequired();

        builder.HasOne(content => content.CreatedByAdmin)
            .WithMany(admin => admin.CreatedContents)
            .HasForeignKey(content => content.CreatedByAdminId);

        builder.HasOne(content => content.UpdatedByAdmin)
            .WithMany(admin => admin.UpdatedContents)
            .HasForeignKey(content => content.UpdatedByAdminId);

        builder.HasOne(content => content.Category)
            .WithMany(category => category.Contents)
            .HasForeignKey(content => content.CategoryId);

        builder.HasOne(content => content.CoverImage)
            .WithMany(image => image.Contents)
            .HasForeignKey(content => content.CoverImageId);

        builder.HasMany(content => content.Sections)
            .WithOne(section => section.Content)
            .HasForeignKey(section => section.ContentId);
            
        builder.Property(content => content.Status)
            .HasConversion<string>();

        builder.Property(content => content.PreviousStatus)
            .HasConversion<string>();

        builder.Property(content => content.VisibilityStatus)
            .HasConversion<string>();

        builder.Property(content => content.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");        

        builder.Property(content => content.UpdatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");    
    }
}

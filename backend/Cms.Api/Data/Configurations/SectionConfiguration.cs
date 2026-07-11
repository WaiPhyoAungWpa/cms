using Cms.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cms.Api.Data.Configurations;

public class SectionConfiguration : IEntityTypeConfiguration<Section>
{
    public void Configure(EntityTypeBuilder<Section> builder)
    {
        builder.HasKey(section => section.Id);

        builder.Property(section => section.Title)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(section => section.Description)
            .IsRequired();

        builder.HasOne(section => section.Content)
            .WithMany(content => content.Sections)
            .HasForeignKey(section => section.ContentId);

        builder.HasOne(section => section.SectionImage)
            .WithMany(image => image.Sections)
            .HasForeignKey(section => section.SectionImageId);
    }
}

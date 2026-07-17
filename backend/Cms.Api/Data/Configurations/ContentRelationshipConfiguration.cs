using Cms.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cms.Api.Data.Configurations;

public class ContentRelationshipConfiguration : IEntityTypeConfiguration<ContentRelationship>
{
    public void Configure(EntityTypeBuilder<ContentRelationship> builder)
    {
        builder.HasKey(contentRelationship => contentRelationship.Id);

        builder.HasOne(contentRelationship => contentRelationship.Content)
            .WithMany(content => content.RelatedContents)
            .HasForeignKey(contentRelationship => contentRelationship.ContentId);

        builder.HasOne(contentRelationship => contentRelationship.RelatedContent)
            .WithMany(content => content.RelatedToContents)
            .HasForeignKey(contentRelationship => contentRelationship.RelatedContentId);

        builder.HasIndex(contentRelationship => new
        {
            contentRelationship.ContentId,
            contentRelationship.RelatedContentId
        })
        .IsUnique();
    }
}
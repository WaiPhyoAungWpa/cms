using Cms.Api.Entities;
using Cms.Api.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cms.Api.Data.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(category => category.Id);

        builder.Property(category => category.Name)
            .IsRequired()
            .HasMaxLength(EntityFieldLengths.CategoryName);

        builder.HasIndex(category => category.Name)
            .IsUnique();

        builder.HasData(
            new Category
            {
                Id = 1,
                Name = "Experience"
            },
            new Category
            {
                Id = 2,
                Name = "Learning"
            },
            new Category
            {
                Id = 3,
                Name = "Lifestyle"
            }
        );
    }
}

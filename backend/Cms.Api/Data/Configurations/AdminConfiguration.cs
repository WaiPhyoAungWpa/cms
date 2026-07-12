using Cms.Api.Entities;
using Cms.Api.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cms.Api.Data.Configurations;

public class AdminConfiguration : IEntityTypeConfiguration<Admin>
{
    public void Configure(EntityTypeBuilder<Admin> builder)
    {
        builder.HasKey(admin => admin.Id);

        builder.Property(admin => admin.Username)
            .IsRequired()
            .HasMaxLength(EntityFieldLengths.AdminUsername);

        builder.HasIndex(admin => admin.Username)
            .IsUnique();

        builder.Property(admin => admin.PasswordHash)
            .IsRequired()
            .HasMaxLength(EntityFieldLengths.PasswordHash);

        builder.Property(admin => admin.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(admin => admin.UpdatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}

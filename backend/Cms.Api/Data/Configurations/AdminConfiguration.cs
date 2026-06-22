using Cms.Api.Entities;
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
            .HasMaxLength(100);

        builder.Property(admin => admin.PasswordHash)
            .IsRequired()
            .HasMaxLength(255);   

        builder.Property(admin => admin.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(admin => admin.UpdatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");     
    }
}

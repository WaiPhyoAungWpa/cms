using Cms.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cms.Api.Data.Context;

public class CmsDbContext(DbContextOptions<CmsDbContext> options) : DbContext(options)
{
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Content> Contents => Set<Content>();
    public DbSet<Section> Sections => Set<Section>();
    public DbSet<Image> Images => Set<Image>();
    public DbSet<ContentRelationship> ContentRelationships => Set<ContentRelationship>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CmsDbContext).Assembly);
    }
}

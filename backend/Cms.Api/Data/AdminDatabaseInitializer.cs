using Cms.Api.Configurations;
using Cms.Api.Data.Context;
using Cms.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Cms.Api.Data;

public class AdminDatabaseInitializer
{
    private readonly CmsDbContext _context;
    private readonly IPasswordHasher<Admin> _passwordHasher;
    private readonly InitialAdminSettings _settings;

    public AdminDatabaseInitializer(
        CmsDbContext context,
        IPasswordHasher<Admin> passwordHasher,
        IOptions<InitialAdminSettings> options)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _settings = options.Value;
    }

    public async Task InitializeAsync()
    {
        await _context.Database.MigrateAsync();

        if (await _context.Admins.AnyAsync())
            return;

        if (string.IsNullOrWhiteSpace(_settings.Username) ||
            string.IsNullOrWhiteSpace(_settings.Password))
        {
            throw new InvalidOperationException(
                "Initial admin credentials are required when no admin account exists.");
        }

        var admin = new Admin
        {
            Username = _settings.Username
        };

        admin.PasswordHash = _passwordHasher.HashPassword(
            admin,
            _settings.Password);

        _context.Admins.Add(admin);

        await _context.SaveChangesAsync();
    }
}
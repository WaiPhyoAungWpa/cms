using Cms.Api.Extensions;
using DotNetEnv;
using System.Text.Json.Serialization;
using Cms.Api.Data;
using Cms.Api.Exceptions;

var builder = WebApplication.CreateBuilder(args);

// Environment
Env.Load(Path.Combine(builder.Environment.ContentRootPath, ".env"));
builder.Configuration.AddEnvironmentVariables();

// MVC
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });

// Application Services
builder.Services.AddApplicationServices(builder.Configuration);

// API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerDocumentation();

// Error Handling
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "Frontend",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .WithOrigins(
                    "http://localhost:5173");
        });
});

var app = builder.Build();

// Database Initialization
using (var scope = app.Services.CreateScope())
{
    var initializer =
        scope.ServiceProvider.GetRequiredService<AdminDatabaseInitializer>();

    await initializer.InitializeAsync();
}

// Development Tools
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

// Endpoints
app.MapControllers();

app.Run();

# CMS

Clean foundation for a CMS built with React, ASP.NET Core 10, PostgreSQL, EF Core, JWT, Docker, and GitHub Actions.

## Run the API

```powershell
dotnet restore cms.slnx
dotnet run --project backend/Cms.Api/Cms.Api.csproj
```

## Run PostgreSQL

```powershell
docker compose up -d postgres
```

## Create the First EF Core Migration

```powershell
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --project backend/Cms.Api/Cms.Api.csproj --startup-project backend/Cms.Api/Cms.Api.csproj --output-dir Data/Migrations
dotnet ef database update --project backend/Cms.Api/Cms.Api.csproj --startup-project backend/Cms.Api/Cms.Api.csproj
```

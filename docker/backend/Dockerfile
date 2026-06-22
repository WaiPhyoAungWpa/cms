FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/Cms.Api/Cms.Api.csproj backend/Cms.Api/
RUN dotnet restore backend/Cms.Api/Cms.Api.csproj

COPY backend/Cms.Api backend/Cms.Api
RUN dotnet publish backend/Cms.Api/Cms.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Cms.Api.dll"]

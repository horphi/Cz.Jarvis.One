#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["src/Cz.Jarvis.Migrator/Cz.Jarvis.Migrator.csproj", "src/Cz.Jarvis.Migrator/"]
COPY ["src/Cz.Jarvis.EntityFrameworkCore/Cz.Jarvis.EntityFrameworkCore.csproj", "src/Cz.Jarvis.EntityFrameworkCore/"]
COPY ["src/Cz.Jarvis.Core/Cz.Jarvis.Core.csproj", "src/Cz.Jarvis.Core/"]
COPY ["src/Cz.Jarvis.Core.Shared/Cz.Jarvis.Core.Shared.csproj", "src/Cz.Jarvis.Core.Shared/"]
RUN dotnet restore "src/Cz.Jarvis.Migrator/Cz.Jarvis.Migrator.csproj"
COPY . .
WORKDIR "/src/src/Cz.Jarvis.Migrator"
RUN dotnet build "Cz.Jarvis.Migrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Cz.Jarvis.Migrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Cz.Jarvis.Migrator.dll", "-s"]

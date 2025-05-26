#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["src/Cz.Jarvis.Web.Host/Cz.Jarvis.Web.Host.csproj", "src/Cz.Jarvis.Web.Host/"]
COPY ["src/Cz.Jarvis.Web.Core/Cz.Jarvis.Web.Core.csproj", "src/Cz.Jarvis.Web.Core/"]
COPY ["src/Cz.Jarvis.Application/Cz.Jarvis.Application.csproj", "src/Cz.Jarvis.Application/"]
COPY ["src/Cz.Jarvis.Application.Shared/Cz.Jarvis.Application.Shared.csproj", "src/Cz.Jarvis.Application.Shared/"]
COPY ["src/Cz.Jarvis.Core.Shared/Cz.Jarvis.Core.Shared.csproj", "src/Cz.Jarvis.Core.Shared/"]
COPY ["src/Cz.Jarvis.Core/Cz.Jarvis.Core.csproj", "src/Cz.Jarvis.Core/"]
COPY ["src/Cz.Jarvis.EntityFrameworkCore/Cz.Jarvis.EntityFrameworkCore.csproj", "src/Cz.Jarvis.EntityFrameworkCore/"]
COPY ["src/Cz.Jarvis.GraphQL/Cz.Jarvis.GraphQL.csproj", "src/Cz.Jarvis.GraphQL/"]
RUN dotnet restore "src/Cz.Jarvis.Web.Host/Cz.Jarvis.Web.Host.csproj"
COPY . .
WORKDIR "/src/src/Cz.Jarvis.Web.Host"
RUN dotnet build "Cz.Jarvis.Web.Host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Cz.Jarvis.Web.Host.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Cz.Jarvis.Web.Host.dll"]

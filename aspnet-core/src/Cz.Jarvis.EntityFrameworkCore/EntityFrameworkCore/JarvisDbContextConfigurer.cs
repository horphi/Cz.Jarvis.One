using System;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Cz.Jarvis.EntityFrameworkCore
{
    public static class JarvisDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<JarvisDbContext> builder, string connectionString)
        {
            var serverVersion = ServerVersion.AutoDetect(connectionString);
            builder.UseMySql(connectionString, serverVersion);
        }

        public static void Configure(DbContextOptionsBuilder<JarvisDbContext> builder, DbConnection connection)
        {
            var serverVersion = ServerVersion.AutoDetect(connection.ConnectionString);
            builder.UseMySql(connection, serverVersion);
        }
    }
}
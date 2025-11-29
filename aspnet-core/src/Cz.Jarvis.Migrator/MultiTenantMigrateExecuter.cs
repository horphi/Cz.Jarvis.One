using System;
using System.Collections.Generic;
using System.Linq;
using Abp.Data;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using Microsoft.Extensions.Configuration;
using Cz.Jarvis.EntityFrameworkCore;
using Cz.Jarvis.Migrations.Seed;

namespace Cz.Jarvis.Migrator
{
    public class MultiTenantMigrateExecuter : ITransientDependency
    {
        public Log Log { get; private set; }

        private readonly AbpZeroDbMigrator _migrator;
        private readonly IDbPerTenantConnectionStringResolver _connectionStringResolver;

        public MultiTenantMigrateExecuter(
            AbpZeroDbMigrator migrator,
            Log log,
            IDbPerTenantConnectionStringResolver connectionStringResolver)
        {
            Log = log;

            _migrator = migrator;
            _connectionStringResolver = connectionStringResolver;
        }

        public void Run(bool skipConnVerification, bool isDockerEnabled = false)
        {
            var hostConnStr = _connectionStringResolver.GetNameOrConnectionString(new ConnectionStringResolveArgs(MultiTenancySides.Host));
            if (hostConnStr.IsNullOrWhiteSpace())
            {
                Log.Write("Configuration file should contain a connection string named 'Default'");
                return;
            }
            Log.Write("Host database: " + ConnectionStringHelper.GetConnectionString(hostConnStr));

            if (!skipConnVerification && !isDockerEnabled)
            {
                Log.Write("Continue to migration for this host database and all tenants..? (Y/N): ");
                var command = Console.ReadLine();
                if (!command.IsIn("Y", "y"))
                {
                    Log.Write("Migration canceled.");
                    return;
                }
            }

            Log.Write("HOST database migration started...");

            try
            {
                _migrator.CreateOrMigrateForHost(SeedHelper.SeedHostDb);
            }
            catch (Exception ex)
            {
                Log.Write("An error occured during migration of host database:");
                Log.Write(ex.ToString());
                Log.Write("Canceled migrations.");
                return;
            }

            Log.Write("HOST database migration completed.");
            Log.Write("--------------------------------------------------------");
            Log.Write("Database migration completed.");
        }
    }
}
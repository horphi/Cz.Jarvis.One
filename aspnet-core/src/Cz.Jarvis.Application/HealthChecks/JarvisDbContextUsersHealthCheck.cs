﻿using System;
using System.Threading;
using System.Threading.Tasks;
using Abp.Domain.Uow;
using Abp.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.HealthChecks
{
    public class JarvisDbContextUsersHealthCheck : IHealthCheck
    {
        private readonly IDbContextProvider<JarvisDbContext> _dbContextProvider;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public JarvisDbContextUsersHealthCheck(
            IDbContextProvider<JarvisDbContext> dbContextProvider,
            IUnitOfWorkManager unitOfWorkManager
            )
        {
            _dbContextProvider = dbContextProvider;
            _unitOfWorkManager = unitOfWorkManager;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            try
            {
                using (var uow = _unitOfWorkManager.Begin())
                {
                    // Switching to host is necessary for single tenant mode.
                    using (_unitOfWorkManager.Current.SetTenantId(null))
                    {
                        var dbContext = await _dbContextProvider.GetDbContextAsync();
                        if (!await dbContext.Database.CanConnectAsync(cancellationToken))
                        {
                            return HealthCheckResult.Unhealthy(
                                "JarvisDbContext could not connect to database"
                            );
                        }

                        var user = await dbContext.Users.AnyAsync(cancellationToken);
                        await uow.CompleteAsync();

                        if (user)
                        {
                            return HealthCheckResult.Healthy("JarvisDbContext connected to database and checked whether user added");
                        }

                        return HealthCheckResult.Unhealthy("JarvisDbContext connected to database but there is no user.");

                    }
                }
            }
            catch (Exception e)
            {
                return HealthCheckResult.Unhealthy("JarvisDbContext could not connect to database.", e);
            }
        }
    }
}

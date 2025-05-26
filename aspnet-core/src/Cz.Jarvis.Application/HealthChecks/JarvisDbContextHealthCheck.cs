using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.HealthChecks
{
    public class JarvisDbContextHealthCheck : IHealthCheck
    {
        private readonly DatabaseCheckHelper _checkHelper;

        public JarvisDbContextHealthCheck(DatabaseCheckHelper checkHelper)
        {
            _checkHelper = checkHelper;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            if (_checkHelper.Exist("db"))
            {
                return Task.FromResult(HealthCheckResult.Healthy("JarvisDbContext connected to database."));
            }

            return Task.FromResult(HealthCheckResult.Unhealthy("JarvisDbContext could not connect to database"));
        }
    }
}

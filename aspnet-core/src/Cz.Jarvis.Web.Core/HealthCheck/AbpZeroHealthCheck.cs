using Microsoft.Extensions.DependencyInjection;
using Cz.Jarvis.HealthChecks;

namespace Cz.Jarvis.Web.HealthCheck
{
    public static class AbpZeroHealthCheck
    {
        public static IHealthChecksBuilder AddAbpZeroHealthCheck(this IServiceCollection services)
        {
            var builder = services.AddHealthChecks();
            builder.AddCheck<JarvisDbContextHealthCheck>("Database Connection");
            builder.AddCheck<JarvisDbContextUsersHealthCheck>("Database Connection with user check");
            builder.AddCheck<CacheHealthCheck>("Cache");

            // add your custom health checks here
            // builder.AddCheck<MyCustomHealthCheck>("my health check");

            return builder;
        }
    }
}

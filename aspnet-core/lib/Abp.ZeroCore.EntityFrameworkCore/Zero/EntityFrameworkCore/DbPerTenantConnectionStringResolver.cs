using System.Threading.Tasks;
using Abp.Configuration.Startup;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.Runtime.Session;

namespace Abp.Zero.EntityFrameworkCore;

/// <summary>
/// Implements <see cref="IDbPerTenantConnectionStringResolver"/> to dynamically resolve
/// connection string for a multi tenant application.
/// </summary>
public class DbPerTenantConnectionStringResolver : DefaultConnectionStringResolver, IDbPerTenantConnectionStringResolver
{
    /// <summary>
    /// Reference to the session.
    /// </summary>
    public IAbpSession AbpSession { get; set; }

    private readonly ICurrentUnitOfWorkProvider _currentUnitOfWorkProvider;

    /// <summary>
    /// Initializes a new instance of the <see cref="DbPerTenantConnectionStringResolver"/> class.
    /// </summary>
    public DbPerTenantConnectionStringResolver(
        IAbpStartupConfiguration configuration,
        ICurrentUnitOfWorkProvider currentUnitOfWorkProvider)
        : base(configuration)
    {
        _currentUnitOfWorkProvider = currentUnitOfWorkProvider;

        AbpSession = NullAbpSession.Instance;
    }

    public override string GetNameOrConnectionString(ConnectionStringResolveArgs args)
    {
        if (args.MultiTenancySide == MultiTenancySides.Host)
        {
            return GetNameOrConnectionString(new DbPerTenantConnectionStringResolveArgs(null, args));
        }

        return GetNameOrConnectionString(new DbPerTenantConnectionStringResolveArgs(GetCurrentTenantId(), args));
    }

    public virtual string GetNameOrConnectionString(DbPerTenantConnectionStringResolveArgs args)
    {
        // Multi-tenancy removed - always use base connection string
        return base.GetNameOrConnectionString(args);
    }


    public override async Task<string> GetNameOrConnectionStringAsync(ConnectionStringResolveArgs args)
    {
        if (args.MultiTenancySide == MultiTenancySides.Host)
        {
            return await GetNameOrConnectionStringAsync(new DbPerTenantConnectionStringResolveArgs(null, args));
        }

        return await GetNameOrConnectionStringAsync(new DbPerTenantConnectionStringResolveArgs(GetCurrentTenantId(), args));
    }

    public virtual async Task<string> GetNameOrConnectionStringAsync(DbPerTenantConnectionStringResolveArgs args)
    {
        // Multi-tenancy removed - always use base connection string
        return await base.GetNameOrConnectionStringAsync(args);
    }

    protected virtual int? GetCurrentTenantId()
    {
        return _currentUnitOfWorkProvider.Current != null
            ? _currentUnitOfWorkProvider.Current.GetTenantId()
            : ((int?)null);
    }
}
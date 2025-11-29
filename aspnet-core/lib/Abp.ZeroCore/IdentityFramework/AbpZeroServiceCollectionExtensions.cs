using System;
using Abp.Authorization;
using Abp.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.MultiTenancy;
using Abp.Zero.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection.Extensions;

// ReSharper disable once CheckNamespace - This is done to add extension methods to Microsoft.Extensions.DependencyInjection namespace
namespace Microsoft.Extensions.DependencyInjection;

public static class AbpZeroServiceCollectionExtensions
{
    public static AbpIdentityBuilder AddAbpIdentity<TUser, TRole>(this IServiceCollection services)
        where TRole : AbpRole<TUser>, new()
        where TUser : AbpUser<TUser>
    {
        return services.AddAbpIdentity<TUser, TRole>(setupAction: null);
    }

    public static AbpIdentityBuilder AddAbpIdentity<TUser, TRole>(this IServiceCollection services, Action<IdentityOptions> setupAction)
        where TRole : AbpRole<TUser>, new()
        where TUser : AbpUser<TUser>
    {
        // Multi-tenancy removed
        services.AddSingleton<IAbpZeroEntityTypes>(new AbpZeroEntityTypes
        {
            Tenant = null,
            Role = typeof(TRole),
            User = typeof(TUser)
        });

        //AbpRoleManager
        services.TryAddScoped<AbpRoleManager<TRole, TUser>>();
        services.TryAddScoped(typeof(RoleManager<TRole>), provider => provider.GetService(typeof(AbpRoleManager<TRole, TUser>)));

        //AbpUserManager
        services.TryAddScoped<AbpUserManager<TRole, TUser>>();
        services.TryAddScoped(typeof(UserManager<TUser>), provider => provider.GetService(typeof(AbpUserManager<TRole, TUser>)));

        //SignInManager
        services.TryAddScoped<AbpSignInManager<TRole, TUser>>();
        services.TryAddScoped(typeof(SignInManager<TUser>), provider => provider.GetService(typeof(AbpSignInManager<TRole, TUser>)));

        //AbpLogInManager
        services.TryAddScoped<AbpLogInManager<TRole, TUser>>();

        //AbpUserClaimsPrincipalFactory
        services.TryAddScoped<AbpUserClaimsPrincipalFactory<TUser, TRole>>();
        services.TryAddScoped(typeof(UserClaimsPrincipalFactory<TUser, TRole>), provider => provider.GetService(typeof(AbpUserClaimsPrincipalFactory<TUser, TRole>)));
        services.TryAddScoped(typeof(IUserClaimsPrincipalFactory<TUser>), provider => provider.GetService(typeof(AbpUserClaimsPrincipalFactory<TUser, TRole>)));

        //AbpSecurityStampValidator
        services.TryAddScoped<AbpSecurityStampValidator<TRole, TUser>>();
        services.TryAddScoped(typeof(SecurityStampValidator<TUser>), provider => provider.GetService(typeof(AbpSecurityStampValidator<TRole, TUser>)));
        services.TryAddScoped(typeof(ISecurityStampValidator), provider => provider.GetService(typeof(AbpSecurityStampValidator<TRole, TUser>)));

        //PermissionChecker
        services.TryAddScoped<PermissionChecker<TRole, TUser>>();
        services.TryAddScoped(typeof(IPermissionChecker), provider => provider.GetService(typeof(PermissionChecker<TRole, TUser>)));

        //AbpUserStore
        services.TryAddScoped<AbpUserStore<TRole, TUser>>();
        services.TryAddScoped(typeof(IUserStore<TUser>), provider => provider.GetService(typeof(AbpUserStore<TRole, TUser>)));

        //AbpRoleStore
        services.TryAddScoped<AbpRoleStore<TRole, TUser>>();
        services.TryAddScoped(typeof(IRoleStore<TRole>), provider => provider.GetService(typeof(AbpRoleStore<TRole, TUser>)));


        return new AbpIdentityBuilder(services.AddIdentity<TUser, TRole>(setupAction), null);
    }
}
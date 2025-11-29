using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Transactions;
using Abp.Auditing;
using Abp.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Localization;
using Abp.MultiTenancy;
using Abp.Zero.Configuration;
using Microsoft.AspNetCore.Identity;

namespace Abp.Authorization;

public class AbpLogInManager<TRole, TUser> : ITransientDependency
    where TRole : AbpRole<TUser>, new()
    where TUser : AbpUser<TUser>
{
    public IClientInfoProvider ClientInfoProvider { get; set; }

    protected IMultiTenancyConfig MultiTenancyConfig { get; }
    protected IUnitOfWorkManager UnitOfWorkManager { get; }
    protected AbpUserManager<TRole, TUser> UserManager { get; }
    protected ISettingManager SettingManager { get; }
    protected IRepository<UserLoginAttempt, long> UserLoginAttemptRepository { get; }
    protected IUserManagementConfig UserManagementConfig { get; }
    protected IIocResolver IocResolver { get; }
    protected AbpRoleManager<TRole, TUser> RoleManager { get; }

    private readonly IPasswordHasher<TUser> _passwordHasher;

    private readonly AbpUserClaimsPrincipalFactory<TUser, TRole> _claimsPrincipalFactory;

    public AbpLogInManager(
        AbpUserManager<TRole, TUser> userManager,
        IMultiTenancyConfig multiTenancyConfig,
        IUnitOfWorkManager unitOfWorkManager,
        ISettingManager settingManager,
        IRepository<UserLoginAttempt, long> userLoginAttemptRepository,
        IUserManagementConfig userManagementConfig,
        IIocResolver iocResolver,
        IPasswordHasher<TUser> passwordHasher,
        AbpRoleManager<TRole, TUser> roleManager,
        AbpUserClaimsPrincipalFactory<TUser, TRole> claimsPrincipalFactory)
    {
        _passwordHasher = passwordHasher;
        _claimsPrincipalFactory = claimsPrincipalFactory;
        MultiTenancyConfig = multiTenancyConfig;
        UnitOfWorkManager = unitOfWorkManager;
        SettingManager = settingManager;
        UserLoginAttemptRepository = userLoginAttemptRepository;
        UserManagementConfig = userManagementConfig;
        IocResolver = iocResolver;
        RoleManager = roleManager;
        UserManager = userManager;

        ClientInfoProvider = NullClientInfoProvider.Instance;
    }

    public virtual async Task<AbpLoginResult<TUser>> LoginAsync(UserLoginInfo login,
        string tenancyName = null)
    {
        return await UnitOfWorkManager.WithUnitOfWorkAsync(async () =>
        {
            var result = await LoginAsyncInternal(login, tenancyName);

            if (ShouldPreventSavingLoginAttempt(result))
            {
                return result;
            }

            await SaveLoginAttemptAsync(result, tenancyName, login.ProviderKey + "@" + login.LoginProvider);
            return result;
        });
    }

    protected virtual bool ShouldPreventSavingLoginAttempt(AbpLoginResult<TUser> loginResult)
    {
        return loginResult.Result == AbpLoginResultType.Success && loginResult.User.IsTwoFactorEnabled;
    }

    protected virtual async Task<AbpLoginResult<TUser>> LoginAsyncInternal(UserLoginInfo login,
        string tenancyName)
    {
        if (login == null || login.LoginProvider.IsNullOrEmpty() || login.ProviderKey.IsNullOrEmpty())
        {
            throw new ArgumentException("login");
        }

        // Multi-tenancy removed
        var user = await UserManager.FindAsync(null, login);
        if (user == null)
        {
            return new AbpLoginResult<TUser>(AbpLoginResultType.UnknownExternalLogin);
        }

        return await CreateLoginResultAsync(user);
    }


    public virtual async Task<AbpLoginResult<TUser>> LoginAsync(
        string userNameOrEmailAddress,
        string plainPassword,
        string tenancyName = null,
        bool shouldLockout = true)
    {
        return await UnitOfWorkManager.WithUnitOfWorkAsync(async () =>
        {
            var result = await LoginAsyncInternal(
                userNameOrEmailAddress,
                plainPassword,
                tenancyName,
                shouldLockout
            );

            if (ShouldPreventSavingLoginAttempt(result))
            {
                return result;
            }

            await SaveLoginAttemptAsync(result, tenancyName, userNameOrEmailAddress);
            return result;
        });
    }

    protected virtual async Task<AbpLoginResult<TUser>> LoginAsyncInternal(
        string userNameOrEmailAddress,
        string plainPassword,
        string tenancyName,
        bool shouldLockout)
    {
        if (userNameOrEmailAddress.IsNullOrEmpty())
        {
            throw new ArgumentNullException(nameof(userNameOrEmailAddress));
        }

        if (plainPassword.IsNullOrEmpty())
        {
            throw new ArgumentNullException(nameof(plainPassword));
        }

        // Multi-tenancy removed
        await UserManager.InitializeOptionsAsync(null);

        //TryLoginFromExternalAuthenticationSources method may create the user, that's why we are calling it before AbpUserStore.FindByNameOrEmailAsync
        var loggedInFromExternalSource = await TryLoginFromExternalAuthenticationSourcesAsync(
            userNameOrEmailAddress,
            plainPassword
        );

        var user = await UserManager.FindByNameOrEmailAsync(null, userNameOrEmailAddress);
        if (user == null)
        {
            return new AbpLoginResult<TUser>(AbpLoginResultType.InvalidUserNameOrEmailAddress);
        }

        if (await UserManager.IsLockedOutAsync(user))
        {
            return new AbpLoginResult<TUser>(AbpLoginResultType.LockedOut, user);
        }

        if (!loggedInFromExternalSource)
        {
            if (!await UserManager.CheckPasswordAsync(user, plainPassword))
            {
                if (shouldLockout && await TryLockOutAsync(null, user.Id))
                {
                    return new AbpLoginResult<TUser>(AbpLoginResultType.LockedOut, user);
                }

                return new AbpLoginResult<TUser>(AbpLoginResultType.InvalidPassword, user);
            }

            await UserManager.ResetAccessFailedCountAsync(user);
        }

        return await CreateLoginResultAsync(user);
    }

    protected virtual async Task<AbpLoginResult<TUser>> CreateLoginResultAsync(TUser user)
    {
        if (!user.IsActive)
        {
            return new AbpLoginResult<TUser>(AbpLoginResultType.UserIsNotActive);
        }

        // Multi-tenancy removed
        if (await IsEmailConfirmationRequiredForLoginAsync(null) && !user.IsEmailConfirmed)
        {
            return new AbpLoginResult<TUser>(AbpLoginResultType.UserEmailIsNotConfirmed);
        }

        if (await IsPhoneConfirmationRequiredForLoginAsync(null) && !user.IsPhoneNumberConfirmed)
        {
            return new AbpLoginResult<TUser>(AbpLoginResultType.UserPhoneNumberIsNotConfirmed);
        }

        var principal = await _claimsPrincipalFactory.CreateAsync(user);

        return new AbpLoginResult<TUser>(
            user,
            principal.Identity as ClaimsIdentity
        );
    }

    // Can be used after two-factor login
    public virtual async Task SaveLoginAttemptAsync(
        AbpLoginResult<TUser> loginResult,
        string tenancyName,
        string userNameOrEmailAddress)
    {
        using (var uow = UnitOfWorkManager.Begin(TransactionScopeOption.Suppress))
        {
            // Multi-tenancy removed
            var loginAttempt = new UserLoginAttempt
            {
                TenantId = null,
                TenancyName = tenancyName.TruncateWithPostfix(UserLoginAttempt.MaxTenancyNameLength),

                UserId = loginResult.User != null ? loginResult.User.Id : (long?)null,
                UserNameOrEmailAddress =
                    userNameOrEmailAddress.TruncateWithPostfix(UserLoginAttempt
                        .MaxUserNameOrEmailAddressLength),

                Result = loginResult.Result,

                BrowserInfo =
                    ClientInfoProvider.BrowserInfo.TruncateWithPostfix(UserLoginAttempt.MaxBrowserInfoLength),
                ClientIpAddress =
                    ClientInfoProvider.ClientIpAddress.TruncateWithPostfix(UserLoginAttempt
                        .MaxClientIpAddressLength),
                ClientName =
                    ClientInfoProvider.ComputerName.TruncateWithPostfix(UserLoginAttempt.MaxClientNameLength),
            };

            using (var localizationContext = IocResolver.ResolveAsDisposable<ILocalizationContext>())
            {
                loginAttempt.FailReason = loginResult
                    .GetFailReason(localizationContext.Object)
                    .TruncateWithPostfix(UserLoginAttempt.MaxFailReasonLength);
            }

            await UserLoginAttemptRepository.InsertAsync(loginAttempt);
            await UnitOfWorkManager.Current.SaveChangesAsync();

            await uow.CompleteAsync();
        }
    }

    public virtual void SaveLoginAttempt(
        AbpLoginResult<TUser> loginResult,
        string tenancyName,
        string userNameOrEmailAddress)
    {
        using (var uow = UnitOfWorkManager.Begin(TransactionScopeOption.Suppress))
        {
            // Multi-tenancy removed
            var loginAttempt = new UserLoginAttempt
            {
                TenantId = null,
                TenancyName = tenancyName.TruncateWithPostfix(UserLoginAttempt.MaxTenancyNameLength),

                UserId = loginResult.User != null ? loginResult.User.Id : (long?)null,
                UserNameOrEmailAddress =
                    userNameOrEmailAddress.TruncateWithPostfix(UserLoginAttempt
                        .MaxUserNameOrEmailAddressLength),

                Result = loginResult.Result,

                BrowserInfo =
                    ClientInfoProvider.BrowserInfo.TruncateWithPostfix(UserLoginAttempt.MaxBrowserInfoLength),
                ClientIpAddress =
                    ClientInfoProvider.ClientIpAddress.TruncateWithPostfix(UserLoginAttempt
                        .MaxClientIpAddressLength),
                ClientName =
                    ClientInfoProvider.ComputerName.TruncateWithPostfix(UserLoginAttempt.MaxClientNameLength),
            };

            using (var localizationContext = IocResolver.ResolveAsDisposable<ILocalizationContext>())
            {
                loginAttempt.FailReason = loginResult
                    .GetFailReason(localizationContext.Object)
                    .TruncateWithPostfix(UserLoginAttempt.MaxFailReasonLength);
            }

            UserLoginAttemptRepository.Insert(loginAttempt);
            UnitOfWorkManager.Current.SaveChanges();

            uow.Complete();
        }
    }

    protected virtual async Task<bool> TryLockOutAsync(int? tenantId, long userId)
    {
        using (var uow = UnitOfWorkManager.Begin(TransactionScopeOption.Suppress))
        {
            // Multi-tenancy removed
            var user = await UserManager.FindByIdAsync(userId.ToString());

            (await UserManager.AccessFailedAsync(user)).CheckErrors();

            var isLockOut = await UserManager.IsLockedOutAsync(user);

            await UnitOfWorkManager.Current.SaveChangesAsync();

            await uow.CompleteAsync();

            return isLockOut;
        }
    }

    protected virtual async Task<bool> TryLoginFromExternalAuthenticationSourcesAsync(string userNameOrEmailAddress,
        string plainPassword)
    {
        if (!UserManagementConfig.ExternalAuthenticationSources.Any())
        {
            return false;
        }

        foreach (var sourceType in UserManagementConfig.ExternalAuthenticationSources)
        {
            using (var source =
                   IocResolver.ResolveAsDisposable<IExternalAuthenticationSource<TUser>>(sourceType))
            {
                // Multi-tenancy removed
                if (await source.Object.TryAuthenticateAsync(userNameOrEmailAddress, plainPassword))
                {
                    var user = await UserManager.FindByNameOrEmailAsync(null, userNameOrEmailAddress);
                    if (user == null)
                    {
                        user = await source.Object.CreateUserAsync(userNameOrEmailAddress);

                        user.AuthenticationSource = source.Object.Name;
                        user.Password =
                            _passwordHasher.HashPassword(user,
                                Guid.NewGuid().ToString("N")
                                    .Left(16)); //Setting a random password since it will not be used
                        user.SetNormalizedNames();

                        if (user.Roles == null)
                        {
                            user.Roles = new List<UserRole>();
                            // Multi-tenancy removed - only check IsDefault
                            foreach (var defaultRole in RoleManager.Roles.Where(r => r.IsDefault).ToList())
                            {
                                user.Roles.Add(new UserRole(user.Id, defaultRole.Id));
                            }
                        }

                        await UserManager.CreateAsync(user);
                    }
                    else
                    {
                        await source.Object.UpdateUserAsync(user);

                        user.AuthenticationSource = source.Object.Name;

                        await UserManager.UpdateAsync(user);
                    }

                    await UnitOfWorkManager.Current.SaveChangesAsync();

                    return true;
                }
            }
        }

        return false;
    }

    protected virtual async Task<bool> IsEmailConfirmationRequiredForLoginAsync(int? tenantId)
    {
        if (tenantId.HasValue)
        {
            return await SettingManager.GetSettingValueForTenantAsync<bool>(
                AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin,
                tenantId.Value
            );
        }

        return await SettingManager.GetSettingValueForApplicationAsync<bool>(
            AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin
        );
    }

    protected virtual Task<bool> IsPhoneConfirmationRequiredForLoginAsync(int? tenantId)
    {
        return Task.FromResult(false);
    }
}
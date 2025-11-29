using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Zero.Configuration;
using Microsoft.AspNetCore.Identity;
using Cz.Jarvis.Authorization.Roles;
using Cz.Jarvis.Authorization.Users;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cz.Jarvis.Authorization
{
    public class LogInManager : AbpLogInManager<Role, User>
    {
        public LogInManager(
            UserManager userManager,
            IMultiTenancyConfig multiTenancyConfig,
            IUnitOfWorkManager unitOfWorkManager,
            ISettingManager settingManager,
            IRepository<UserLoginAttempt, long> userLoginAttemptRepository,
            IUserManagementConfig userManagementConfig,
            IIocResolver iocResolver,
            RoleManager roleManager,
            IPasswordHasher<User> passwordHasher,
            UserClaimsPrincipalFactory claimsPrincipalFactory)
            : base(
                  userManager,
                  multiTenancyConfig,
                  unitOfWorkManager,
                  settingManager,
                  userLoginAttemptRepository,
                  userManagementConfig,
                  iocResolver,
                  passwordHasher,
                  roleManager,
                  claimsPrincipalFactory)
        {

        }

        /// <summary>
        /// Exposes protected method CreateLoginResultAsync
        /// </summary>
        /// <param name="user">User to create login result</param>
        /// <returns></returns>
        public Task<AbpLoginResult<User>> CreateLoginResultAsync(User user)
        {
            return base.CreateLoginResultAsync(user);
        }
    }
}
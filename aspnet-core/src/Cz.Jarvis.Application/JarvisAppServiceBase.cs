using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.IdentityFramework;
using Abp.Runtime.Session;
using Abp.Threading;
using Microsoft.AspNetCore.Identity;
using Cz.Jarvis.Authorization.Users;

namespace Cz.Jarvis
{
    /// <summary>
    /// Derive your application services from this class.
    /// </summary>
    public abstract class JarvisAppServiceBase : ApplicationService
    {
        public UserManager UserManager { get; set; }

        protected JarvisAppServiceBase()
        {
            LocalizationSourceName = JarvisConsts.LocalizationSourceName;
        }

        protected virtual async Task<User> GetCurrentUserAsync()
        {
            var user = await UserManager.FindByIdAsync(AbpSession.GetUserId().ToString());
            if (user == null)
            {
                throw new Exception("There is no current user!");
            }

            return user;
        }

        protected virtual User GetCurrentUser()
        {
            return AsyncHelper.RunSync(GetCurrentUserAsync);
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
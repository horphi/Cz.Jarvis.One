using System;
using System.Linq;
using System.Threading.Tasks;
using Abp;
using Abp.Authorization;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Runtime.Security;
using Abp.UI;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Cz.Jarvis.Authorization;
using Cz.Jarvis.Authorization.Delegation;
using Cz.Jarvis.Authorization.Roles;
using Cz.Jarvis.Authorization.Users;

namespace Cz.Jarvis.Identity
{
    public class SecurityStampValidator : AbpSecurityStampValidator<Role, User>
    {
        private readonly IUserDelegationManager _userDelegationManager;
        private readonly IUserDelegationConfiguration _userDelegationConfiguration;
        private readonly PermissionChecker _permissionChecker;

        public SecurityStampValidator(
            IOptions<SecurityStampValidatorOptions> options,
            SignInManager signInManager,
            ILoggerFactory loggerFactory,
            IUserDelegationConfiguration userDelegationConfiguration,
            IUserDelegationManager userDelegationManager,
            PermissionChecker permissionChecker,
            IUnitOfWorkManager unitOfWorkManager)
            : base(options, signInManager, loggerFactory, unitOfWorkManager)
        {
            _userDelegationConfiguration = userDelegationConfiguration;
            _userDelegationManager = userDelegationManager;
            _permissionChecker = permissionChecker;
        }

        public override Task ValidateAsync(CookieValidatePrincipalContext context)
        {
            ValidateUserDelegation(context);

            return base.ValidateAsync(context);
        }

        private void ValidateUserDelegation(CookieValidatePrincipalContext context)
        {
            if (!_userDelegationConfiguration.IsEnabled)
            {
                return;
            }

            var user = context.Principal.Claims.FirstOrDefault(c => c.Type == AbpClaimTypes.UserId);
            var impersonatorUser = context.Principal.Claims.FirstOrDefault(c => c.Type == AbpClaimTypes.ImpersonatorUserId);

            if (impersonatorUser == null || user == null)
            {
                return;
            }

            var sourceUserId = Convert.ToInt64(user.Value);
            var targetUserId = Convert.ToInt64(impersonatorUser.Value);

            // Multi-tenancy removed
            if (_permissionChecker.IsGranted(new UserIdentifier(null, targetUserId), AppPermissions.Pages_Administration_Users_Impersonation))
            {
                return;
            }

            var hasActiveDelegation = _userDelegationManager.HasActiveDelegation(sourceUserId, targetUserId);

            if (!hasActiveDelegation)
            {
                throw new UserFriendlyException("ThereIsNoActiveUserDelegationBetweenYourUserAndCurrentUser");
            }
        }
    }
}
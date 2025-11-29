using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Domain.Uow;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Cz.Jarvis.Authorization.Roles;
using Cz.Jarvis.Authorization.Users;
using Cz.Jarvis.Configuration;

namespace Cz.Jarvis.Identity
{
    public class SignInManager : AbpSignInManager<Role, User>
    {
        private readonly ISettingManager _settingManager;
        private readonly IAbpSession _abpSession;

        public SignInManager(
            UserManager userManager,
            IHttpContextAccessor contextAccessor,
            UserClaimsPrincipalFactory claimsFactory,
            IOptions<IdentityOptions> optionsAccessor,
            ILogger<SignInManager<User>> logger,
            IUnitOfWorkManager unitOfWorkManager,
            ISettingManager settingManager,
            IAuthenticationSchemeProvider schemes,
            IUserConfirmation<User> userConfirmation,
            IAbpSession abpSession)
            : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, unitOfWorkManager, settingManager, schemes, userConfirmation)
        {
            _settingManager = settingManager;
            _abpSession = abpSession;
        }

        public override async Task<IEnumerable<AuthenticationScheme>> GetExternalAuthenticationSchemesAsync()
        {
            var schemes = await base.GetExternalAuthenticationSchemesAsync();          

            return schemes;
        }

        
    }
}

using Abp.AspNetCore.OpenIddict.Claims;
using Abp.AspNetCore.OpenIddict.Controllers;
using Abp.Authorization;
using Abp.Authorization.Users;
using Cz.Jarvis.Authorization.Roles;
using Cz.Jarvis.Authorization.Users;
// using Cz.Jarvis.MultiTenancy; // Multi-tenancy removed
using OpenIddict.Abstractions;

namespace Cz.Jarvis.Web.OpenIddict.Controllers
{
    public partial class TokenController : TokenController<Role, User>
    {
        public TokenController(AbpSignInManager<Role, User> signInManager,
            AbpUserManager<Role, User> userManager, IOpenIddictApplicationManager applicationManager,
            IOpenIddictAuthorizationManager authorizationManager, IOpenIddictScopeManager scopeManager,
            IOpenIddictTokenManager tokenManager,
            AbpOpenIddictClaimsPrincipalManager openIddictClaimsPrincipalManager) : base(signInManager, userManager,
            applicationManager, authorizationManager, scopeManager, tokenManager, openIddictClaimsPrincipalManager)
        {
        }
    }
}
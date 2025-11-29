using System;
using Abp.AspNetCore.Mvc.Controllers;
using Abp.Configuration.Startup;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Cz.Jarvis.Web.Controllers
{
    public abstract class JarvisControllerBase : AbpController
    {
        protected JarvisControllerBase()
        {
            LocalizationSourceName = JarvisConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        protected void SetTenantIdCookie(int? tenantId)
        {
            // Multi-tenancy removed - method stubbed out
        }
    }
}
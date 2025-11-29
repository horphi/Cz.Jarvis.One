using System.Collections.Generic;
using Cz.AspNetJarvisCore;
using Cz.AspNetJarvisCore.Web.Authentication.External;
using Cz.AspNetJarvisCore.Web.Authentication.External.Facebook;
using Cz.AspNetJarvisCore.Web.Authentication.External.Google;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Extensions;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Threading.BackgroundWorkers;
using Abp.Timing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Cz.Jarvis.Auditing;
using Cz.Jarvis.Authorization.Users.Password;
using Cz.Jarvis.Configuration;
using Cz.Jarvis.EntityFrameworkCore;
using Cz.Jarvis.Web.Startup.ExternalLoginInfoProviders;

namespace Cz.Jarvis.Web.Startup
{
    [DependsOn(
        typeof(JarvisWebCoreModule)
    )]
    public class JarvisWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public JarvisWebHostModule(
            IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize()
        {
            // Multi-tenancy removed
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JarvisWebHostModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            using (var scope = IocManager.CreateScope())
            {
                if (!scope.Resolve<DatabaseCheckHelper>().Exist(_appConfiguration["ConnectionStrings:Default"]))
                {
                    return;
                }
            }

            var workManager = IocManager.Resolve<IBackgroundWorkerManager>();

            var expiredAuditLogDeleterWorker = IocManager.Resolve<ExpiredAuditLogDeleterWorker>();
            if (Configuration.Auditing.IsEnabled && expiredAuditLogDeleterWorker.IsEnabled)
            {
                workManager.Add(expiredAuditLogDeleterWorker);
            }

            workManager.Add(IocManager.Resolve<PasswordExpirationBackgroundWorker>());

            ConfigureExternalAuthProviders();
        }

        private void ConfigureExternalAuthProviders()
        {
            var externalAuthConfiguration = IocManager.Resolve<ExternalAuthConfiguration>();

            //Facebook
            if (bool.Parse(_appConfiguration["Authentication:Facebook:IsEnabled"]))
            {

                externalAuthConfiguration.ExternalLoginInfoProviders.Add(new FacebookExternalLoginInfoProvider(
                    _appConfiguration["Authentication:Facebook:AppId"],
                    _appConfiguration["Authentication:Facebook:AppSecret"]
                ));

            }


            //Google
            if (bool.Parse(_appConfiguration["Authentication:Google:IsEnabled"]))
            {

                externalAuthConfiguration.ExternalLoginInfoProviders.Add(
                    new GoogleExternalLoginInfoProvider(
                        _appConfiguration["Authentication:Google:ClientId"],
                        _appConfiguration["Authentication:Google:ClientSecret"],
                        _appConfiguration["Authentication:Google:UserInfoEndpoint"]
                    )
                );

            }

        }
    }
}
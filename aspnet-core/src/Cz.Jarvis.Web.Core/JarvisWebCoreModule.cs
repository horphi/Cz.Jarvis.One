using System;
using System.IO;
using System.Linq;
using System.Text;
using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.AspNetCore.MultiTenancy;
using Abp.AspNetCore.OpenIddict;
using Abp.AspNetCore.SignalR;
using Cz.AspNetJarvisCore.Web;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Domain.Entities;
using Abp.Hangfire;
using Abp.Hangfire.Configuration;
using Abp.IO;
using Abp.Modules;
using Abp.MultiTenancy;
using Abp.Reflection.Extensions;
using Abp.Runtime.Caching.Redis;
using Abp.Text;
using Abp.Timing;
using Abp.Web.MultiTenancy;
using Abp.Zero.Configuration;
using Castle.Core.Internal;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Cz.Jarvis.Authentication.TwoFactor;
using Cz.Jarvis.Chat;
using Cz.Jarvis.Configuration;
using Cz.Jarvis.EntityFrameworkCore;
using Cz.Jarvis.Startup;
using Cz.Jarvis.Web.Authentication.JwtBearer;
using Cz.Jarvis.Web.Authentication.TwoFactor;
using Cz.Jarvis.Web.Chat.SignalR;
using Cz.Jarvis.Web.Common;
using Cz.Jarvis.Web.Configuration;
using Abp.Extensions;
using Abp.HtmlSanitizer;
using Abp.HtmlSanitizer.Configuration;
using Cz.Jarvis.Authorization.Accounts;

namespace Cz.Jarvis.Web
{
    [DependsOn(
        typeof(JarvisApplicationModule),
        typeof(JarvisEntityFrameworkCoreModule),
        typeof(CzAspNetJarvisCoreWebModule),
        typeof(AbpAspNetCoreSignalRModule),
        typeof(JarvisGraphQLModule),
        typeof(AbpRedisCacheModule), //AbpRedisCacheModule dependency (and Abp.RedisCache nuget package) can be removed if not using Redis cache
        typeof(AbpHangfireAspNetCoreModule), //AbpHangfireModule dependency (and Abp.Hangfire.AspNetCore nuget package) can be removed if not using Hangfire
        typeof(AbpHtmlSanitizerModule),
        typeof(AbpAspNetCoreOpenIddictModule)
    )]
    public class JarvisWebCoreModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public JarvisWebCoreModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize()
        {
            //Set default connection string
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                JarvisConsts.ConnectionStringName
            );

            //Use database for language management
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            Configuration.Modules.AbpAspNetCore()
                .CreateControllersForAppServices(
                    typeof(JarvisApplicationModule).GetAssembly()
                );

            Configuration.Caching.Configure(TwoFactorCodeCacheItem.CacheName,
                cache => { cache.DefaultSlidingExpireTime = TwoFactorCodeCacheItem.DefaultSlidingExpireTime; });

            if (_appConfiguration["Authentication:JwtBearer:IsEnabled"] != null &&
                bool.Parse(_appConfiguration["Authentication:JwtBearer:IsEnabled"]))
            {
                ConfigureTokenAuth();
            }

            Configuration.ReplaceService<IAppConfigurationAccessor, AppConfigurationAccessor>();

            Configuration.ReplaceService<IAppConfigurationWriter, AppConfigurationWriter>();

            if (WebConsts.HangfireDashboardEnabled)
            {
                Configuration.BackgroundJobs.UseHangfire();
            }

            //Uncomment this line to use Redis cache instead of in-memory cache.
            //See app.config for Redis configuration and connection string
            //Configuration.Caching.UseRedis(options =>
            //{
            //    options.ConnectionString = _appConfiguration["Abp:RedisCache:ConnectionString"];
            //    options.DatabaseId = _appConfiguration.GetValue<int>("Abp:RedisCache:DatabaseId");
            //});

            // HTML Sanitizer configuration
            Configuration.Modules.AbpHtmlSanitizer()
                .KeepChildNodes()
                .AddSelector<IAccountAppService>(x => nameof(x.IsTenantAvailable))
                .AddSelector<IAccountAppService>(x => nameof(x.Register));
        }

        private void ConfigureTokenAuth()
        {
            IocManager.Register<TokenAuthConfiguration>();
            var tokenAuthConfig = IocManager.Resolve<TokenAuthConfiguration>();

            tokenAuthConfig.SecurityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_appConfiguration["Authentication:JwtBearer:SecurityKey"])
            );

            tokenAuthConfig.Issuer = _appConfiguration["Authentication:JwtBearer:Issuer"];
            tokenAuthConfig.Audience = _appConfiguration["Authentication:JwtBearer:Audience"];
            tokenAuthConfig.SigningCredentials =
                new SigningCredentials(tokenAuthConfig.SecurityKey, SecurityAlgorithms.HmacSha256);
            tokenAuthConfig.AccessTokenExpiration = AppConsts.AccessTokenExpiration;
            tokenAuthConfig.RefreshTokenExpiration = AppConsts.RefreshTokenExpiration;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JarvisWebCoreModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            SetAppFolders();

            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(JarvisWebCoreModule).Assembly);
        }

        private void SetAppFolders()
        {
            var appFolders = IocManager.Resolve<AppFolders>();

            appFolders.SampleProfileImagesFolder = Path.Combine(_env.WebRootPath,
                $"Common{Path.DirectorySeparatorChar}Images{Path.DirectorySeparatorChar}SampleProfilePics");
            appFolders.WebLogsFolder = Path.Combine(_env.ContentRootPath, $"App_Data{Path.DirectorySeparatorChar}Logs");
        }
    }
}
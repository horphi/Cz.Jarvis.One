using System;

using Abp.AspNetCore;
using Abp.Dependency;
using Abp.Modules;

namespace Cz.AspNetJarvisCore.Web
{
    //[DependsOn(new Type[] { typeof(AbpczjarvisCoreModule) })]
    [DependsOn(new Type[] { typeof(AbpAspNetCoreModule) })]
    public class CzAspNetJarvisCoreWebModule : AbpModule
    {
        public override void PreInitialize()
        {
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CzAspNetJarvisCoreWebModule).Assembly);
        }

        public CzAspNetJarvisCoreWebModule()
        {
        }
    }
}

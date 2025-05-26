using Abp.Dependency;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Cz.AspNetJarvisCore
{
    public class CzAspNetJarvisCoreModule : AbpModule
    {
        public override void PreInitialize()
        {
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CzAspNetJarvisCoreModule).GetAssembly());
        }

        public override void PostInitialize()
        {
        }
    }
}

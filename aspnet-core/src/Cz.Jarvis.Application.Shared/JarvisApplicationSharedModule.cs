using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Cz.Jarvis
{
    [DependsOn(typeof(JarvisCoreSharedModule))]
    public class JarvisApplicationSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JarvisApplicationSharedModule).GetAssembly());
        }
    }
}
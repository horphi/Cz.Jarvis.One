using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Cz.Jarvis
{
    public class JarvisCoreSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JarvisCoreSharedModule).GetAssembly());
        }
    }
}
using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Cz.Jarvis.Startup
{
    [DependsOn(typeof(JarvisCoreModule))]
    public class JarvisGraphQLModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JarvisGraphQLModule).GetAssembly());
        }

        public override void PreInitialize()
        {
            base.PreInitialize();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }
    }
}
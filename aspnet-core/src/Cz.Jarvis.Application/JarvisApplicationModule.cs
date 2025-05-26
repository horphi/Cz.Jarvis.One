using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Cz.Jarvis.Authorization;

namespace Cz.Jarvis
{
    /// <summary>
    /// Application layer module of the application.
    /// </summary>
    [DependsOn(
        typeof(JarvisApplicationSharedModule),
        typeof(JarvisCoreModule)
        )]
    public class JarvisApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Adding authorization providers
            Configuration.Authorization.Providers.Add<AppAuthorizationProvider>();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JarvisApplicationModule).GetAssembly());
        }
    }
}
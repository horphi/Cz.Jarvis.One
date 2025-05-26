using Cz.AspNetJarvisCore;
using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;
using Cz.Jarvis.Configuration;
using Cz.Jarvis.EntityFrameworkCore;
using Cz.Jarvis.Migrator.DependencyInjection;

namespace Cz.Jarvis.Migrator
{
    [DependsOn(typeof(JarvisEntityFrameworkCoreModule))]
    public class JarvisMigratorModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public JarvisMigratorModule(JarvisEntityFrameworkCoreModule abpZeroTemplateEntityFrameworkCoreModule)
        {
            abpZeroTemplateEntityFrameworkCoreModule.SkipDbSeed = true;

            _appConfiguration = AppConfigurations.Get(
                typeof(JarvisMigratorModule).GetAssembly().GetDirectoryPathOrNull(),
                addUserSecrets: true
            );
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                JarvisConsts.ConnectionStringName
                );
            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
            Configuration.ReplaceService(typeof(IEventBus), () =>
            {
                IocManager.IocContainer.Register(
                    Component.For<IEventBus>().Instance(NullEventBus.Instance)
                );
            });
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JarvisMigratorModule).GetAssembly());
            ServiceCollectionRegistrar.Register(IocManager);
        }
    }
}
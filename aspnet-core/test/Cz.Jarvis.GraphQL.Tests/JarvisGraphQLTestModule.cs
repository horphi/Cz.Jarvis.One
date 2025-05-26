using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Cz.Jarvis.Configure;
using Cz.Jarvis.Startup;
using Cz.Jarvis.Test.Base;

namespace Cz.Jarvis.GraphQL.Tests
{
    [DependsOn(
        typeof(JarvisGraphQLModule),
        typeof(JarvisTestBaseModule))]
    public class JarvisGraphQLTestModule : AbpModule
    {
        public override void PreInitialize()
        {
            IServiceCollection services = new ServiceCollection();
            
            services.AddAndConfigureGraphQL();

            WindsorRegistrationHelper.CreateServiceProvider(IocManager.IocContainer, services);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JarvisGraphQLTestModule).GetAssembly());
        }
    }
}
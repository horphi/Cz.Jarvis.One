using Abp.Dependency;
using Abp.Reflection.Extensions;
using Microsoft.Extensions.Configuration;
using Cz.Jarvis.Configuration;

namespace Cz.Jarvis.Test.Base
{
    public class TestAppConfigurationAccessor : IAppConfigurationAccessor, ISingletonDependency
    {
        public IConfigurationRoot Configuration { get; }

        public TestAppConfigurationAccessor()
        {
            Configuration = AppConfigurations.Get(
                typeof(JarvisTestBaseModule).GetAssembly().GetDirectoryPathOrNull()
            );
        }
    }
}

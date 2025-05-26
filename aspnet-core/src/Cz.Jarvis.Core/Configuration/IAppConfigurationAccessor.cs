using Microsoft.Extensions.Configuration;

namespace Cz.Jarvis.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}

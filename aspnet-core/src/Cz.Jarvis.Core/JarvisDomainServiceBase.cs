using Abp.Domain.Services;

namespace Cz.Jarvis
{
    public abstract class JarvisDomainServiceBase : DomainService
    {
        /* Add your common members for all your domain services. */

        protected JarvisDomainServiceBase()
        {
            LocalizationSourceName = JarvisConsts.LocalizationSourceName;
        }
    }
}

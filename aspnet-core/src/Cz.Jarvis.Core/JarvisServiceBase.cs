using Abp;

namespace Cz.Jarvis
{
    /// <summary>
    /// This class can be used as a base class for services in this application.
    /// It has some useful objects property-injected and has some basic methods most of services may need to.
    /// It's suitable for non domain nor application service classes.
    /// For domain services inherit <see cref="Cz.JarvisDomainServiceBase"/>.
    /// For application services inherit Cz.JarvisAppServiceBase.
    /// </summary>
    public abstract class JarvisServiceBase : AbpServiceBase
    {
        protected JarvisServiceBase()
        {
            LocalizationSourceName = JarvisConsts.LocalizationSourceName;
        }
    }
}
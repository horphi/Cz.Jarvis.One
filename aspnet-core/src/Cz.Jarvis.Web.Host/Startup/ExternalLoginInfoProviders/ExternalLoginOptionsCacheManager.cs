using Cz.AspNetJarvisCore.Web.Authentication.External.Facebook;
using Cz.AspNetJarvisCore.Web.Authentication.External.Google;
using Abp.Dependency;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
using Cz.Jarvis.Configuration;

namespace Cz.Jarvis.Web.Startup.ExternalLoginInfoProviders
{
    public class ExternalLoginOptionsCacheManager : IExternalLoginOptionsCacheManager, ITransientDependency
    {
        private readonly ICacheManager _cacheManager;
        private readonly IAbpSession _abpSession;

        public ExternalLoginOptionsCacheManager(ICacheManager cacheManager, IAbpSession abpSession)
        {
            _cacheManager = cacheManager;
            _abpSession = abpSession;
        }

        public void ClearCache()
        {
            _cacheManager.GetExternalLoginInfoProviderCache().Remove(GetCacheKey(FacebookAuthProviderApi.Name));
            _cacheManager.GetExternalLoginInfoProviderCache().Remove(GetCacheKey(GoogleAuthProviderApi.Name));
        }

        private string GetCacheKey(string name)
        {
            // Multi-tenancy removed - no tenant-based cache differentiation
            return $"{name}";
        }
    }
}
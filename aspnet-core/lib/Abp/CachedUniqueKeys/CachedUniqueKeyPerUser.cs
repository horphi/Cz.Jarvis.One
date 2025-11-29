using System;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;

namespace Abp.CachedUniqueKeys
{
    public class CachedUniqueKeyPerUser : ICachedUniqueKeyPerUser, ITransientDependency
    {
        public IAbpSession AbpSession { get; set; }

        private readonly ICacheManager _cacheManager;

        public CachedUniqueKeyPerUser(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
            AbpSession = NullAbpSession.Instance;
        }

        public virtual Task<string> GetKeyAsync(string cacheName)
        {
            return GetKeyAsync(cacheName, AbpSession.UserId);
        }

        public virtual Task RemoveKeyAsync(string cacheName)
        {
            return RemoveKeyAsync(cacheName, AbpSession.UserId);
        }

        public virtual Task<string> GetKeyAsync(string cacheName, UserIdentifier user)
        {
            return GetKeyAsync(cacheName, user.UserId);
        }

        public virtual Task RemoveKeyAsync(string cacheName, UserIdentifier user)
        {
            return RemoveKeyAsync(cacheName, user.UserId);
        }

        public virtual async Task<string> GetKeyAsync(string cacheName, long? userId)
        {
            if (!AbpSession.UserId.HasValue)
            {
                return Guid.NewGuid().ToString("N");
            }

            var cache = GetCache(cacheName);
            return await cache.GetAsync(GetCacheKeyForUser(userId),
                () => Task.FromResult(Guid.NewGuid().ToString("N")));
        }

        public virtual async Task RemoveKeyAsync(string cacheName, long? userId)
        {
            if (!AbpSession.UserId.HasValue)
            {
                return;
            }

            var cache = GetCache(cacheName);
            await cache.RemoveAsync(GetCacheKeyForUser(userId));
        }

        public virtual async Task ClearCacheAsync(string cacheName)
        {
            var cache = GetCache(cacheName);
            await cache.ClearAsync();
        }

        public virtual string GetKey(string cacheName)
        {
            return GetKey(cacheName, AbpSession.UserId);
        }

        public virtual void RemoveKey(string cacheName)
        {
            RemoveKey(cacheName, AbpSession.UserId);
        }

        public virtual string GetKey(string cacheName, UserIdentifier user)
        {
            return GetKey(cacheName, user.UserId);
        }

        public virtual void RemoveKey(string cacheName, UserIdentifier user)
        {
            RemoveKey(cacheName, user.UserId);
        }

        public virtual string GetKey(string cacheName, long? userId)
        {
            if (!AbpSession.UserId.HasValue)
            {
                return Guid.NewGuid().ToString("N");
            }

            var cache = GetCache(cacheName);
            return cache.Get(GetCacheKeyForUser(userId),
                () => Guid.NewGuid().ToString("N"));
        }

        public virtual void RemoveKey(string cacheName, long? userId)
        {
            if (!AbpSession.UserId.HasValue)
            {
                return;
            }

            var cache = GetCache(cacheName);
            cache.Remove(GetCacheKeyForUser(userId));
        }

        public virtual void ClearCache(string cacheName)
        {
            var cache = GetCache(cacheName);
            cache.Clear();
        }

        protected virtual ITypedCache<string, string> GetCache(string cacheName)
        {
            return _cacheManager.GetCache<string, string>(cacheName);
        }

        protected virtual string GetCacheKeyForUser(long? userId)
        {
            return userId.ToString();
        }
    }
}
using System;
using Abp.Configuration.Startup;
using Abp.MultiTenancy;

namespace Abp.Runtime.Session
{
    public abstract class AbpSessionBase : IAbpSession
    {
        public const string SessionOverrideContextKey = "Abp.Runtime.Session.Override";

        public IMultiTenancyConfig MultiTenancy { get; }

        public abstract long? UserId { get; }


        public abstract long? ImpersonatorUserId { get; }


        public virtual MultiTenancySides MultiTenancySide
        {
            get
            {
                return MultiTenancySides.Host;
            }
        }

        protected SessionOverride OverridedValue => SessionOverrideScopeProvider.GetValue(SessionOverrideContextKey);
        protected IAmbientScopeProvider<SessionOverride> SessionOverrideScopeProvider { get; }

        protected AbpSessionBase(IMultiTenancyConfig multiTenancy, IAmbientScopeProvider<SessionOverride> sessionOverrideScopeProvider)
        {
            MultiTenancy = multiTenancy;
            SessionOverrideScopeProvider = sessionOverrideScopeProvider;
        }

        public IDisposable Use( long? userId)
        {
            return SessionOverrideScopeProvider.BeginScope(SessionOverrideContextKey, new SessionOverride( userId));
        }
    }
}
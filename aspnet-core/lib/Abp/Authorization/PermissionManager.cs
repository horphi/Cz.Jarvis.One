using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Abp.Collections.Extensions;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.MultiTenancy;
using Abp.Runtime.Session;

namespace Abp.Authorization
{
    /// <summary>
    /// Permission manager.
    /// </summary>
    public class PermissionManager : PermissionDefinitionContextBase, IPermissionManager, ISingletonDependency
    {
        public IAbpSession AbpSession { get; set; }

        private readonly IIocManager _iocManager;
        private readonly IAuthorizationConfiguration _authorizationConfiguration;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IMultiTenancyConfig _multiTenancy;

        /// <summary>
        /// Constructor.
        /// </summary>
        public PermissionManager(
            IIocManager iocManager,
            IAuthorizationConfiguration authorizationConfiguration,
            IUnitOfWorkManager unitOfWorkManager,
            IMultiTenancyConfig multiTenancy)
        {
            _iocManager = iocManager;
            _authorizationConfiguration = authorizationConfiguration;
            _unitOfWorkManager = unitOfWorkManager;
            _multiTenancy = multiTenancy;

            AbpSession = NullAbpSession.Instance;
        }

        public virtual void Initialize()
        {
            foreach (var providerType in _authorizationConfiguration.Providers)
            {
                using (var provider = _iocManager.ResolveAsDisposable<AuthorizationProvider>(providerType))
                {
                    provider.Object.SetPermissions(this);
                }
            }

            Permissions.AddAllPermissions();
        }

        public virtual Permission GetPermission(string name)
        {
            var permission = Permissions.GetOrDefault(name);
            if (permission == null)
            {
                throw new AbpException("There is no permission with name: " + name);
            }

            return permission;
        }

        public virtual IReadOnlyList<Permission> GetAllPermissions(bool tenancyFilter = true)
        {
            return Permissions.Values
                .WhereIf(tenancyFilter, p => p.MultiTenancySides.HasFlag(GetCurrentMultiTenancySide()))
                //.Where(predicate => GetCurrentMultiTenancySide() == MultiTenancySides.Host)
                .ToImmutableList();
        }

        public virtual async Task<IReadOnlyList<Permission>> GetAllPermissionsAsync(bool tenancyFilter = true)
        {
            var permissions = Permissions.Values
                .WhereIf(tenancyFilter, p => p.MultiTenancySides.HasFlag(GetCurrentMultiTenancySide()))
                //.Where(p => GetCurrentMultiTenancySide() == MultiTenancySides.Host)
                .ToList();

            return permissions.ToImmutableList();
        }

        public virtual IReadOnlyList<Permission> GetAllPermissions(MultiTenancySides multiTenancySides)
        {
            return Permissions.Values
                .Where(p => p.MultiTenancySides.HasFlag(multiTenancySides))
                .Where(p =>
                    GetCurrentMultiTenancySide() == MultiTenancySides.Host ||
                    (p.MultiTenancySides.HasFlag(MultiTenancySides.Host) &&
                     multiTenancySides.HasFlag(MultiTenancySides.Host))
                ).ToImmutableList();
        }

        public virtual async Task<IReadOnlyList<Permission>> GetAllPermissionsAsync(MultiTenancySides multiTenancySides)
        {
            var permissions = Permissions.Values
                .Where(p => p.MultiTenancySides.HasFlag(multiTenancySides))
                .Where(p => GetCurrentMultiTenancySide() == MultiTenancySides.Host ||
                            (p.MultiTenancySides.HasFlag(MultiTenancySides.Host) &&
                             multiTenancySides.HasFlag(MultiTenancySides.Host)))
                .ToList();
            return permissions.ToImmutableList();
        }


        private MultiTenancySides GetCurrentMultiTenancySide()
        {
            if (_unitOfWorkManager.Current != null)
            {
                return _multiTenancy.IsEnabled && !_unitOfWorkManager.Current.GetTenantId().HasValue
                    ? MultiTenancySides.Host
                    : MultiTenancySides.Tenant;
            }

            return AbpSession.MultiTenancySide;
        }

        private int? GetCurrentTenantId()
        {
            if (_unitOfWorkManager.Current != null)
            {
                return _unitOfWorkManager.Current.GetTenantId();
            }

            return ((int?)null);
        }
    }
}
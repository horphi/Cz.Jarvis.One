using System.Collections.Generic;
using Abp.Collections.Extensions;
using Abp.Localization;
using Abp.MultiTenancy;

namespace Abp.Authorization
{
    public abstract class PermissionDefinitionContextBase : IPermissionDefinitionContext
    {
        protected readonly PermissionDictionary Permissions;

        protected PermissionDefinitionContextBase()
        {
            Permissions = new PermissionDictionary();
        }

        public Permission CreatePermission(
            string name,
            ILocalizableString displayName = null,
            ILocalizableString description = null,
            MultiTenancySides multiTenancySides = MultiTenancySides.Host | MultiTenancySides.Tenant,
            Dictionary<string, object> properties = null)
        {
            if (Permissions.ContainsKey(name))
            {
                throw new AbpException("There is already a permission with name: " + name);
            }

            var permission = new Permission(name, displayName, description, multiTenancySides, properties);
            Permissions[permission.Name] = permission;
            return permission;
        }

        public virtual Permission GetPermissionOrNull(string name)
        {
            return Permissions.GetOrDefault(name);
        }

        public virtual void RemovePermission(string name)
        {
            Permissions.Remove(name);
        }
    }
}
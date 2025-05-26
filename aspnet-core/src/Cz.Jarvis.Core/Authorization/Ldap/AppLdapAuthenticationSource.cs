using Abp.Zero.Ldap.Authentication;
using Abp.Zero.Ldap.Configuration;
using Cz.Jarvis.Authorization.Users;
using Cz.Jarvis.MultiTenancy;

namespace Cz.Jarvis.Authorization.Ldap
{
    public class AppLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public AppLdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}
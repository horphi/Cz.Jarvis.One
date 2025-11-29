using System.DirectoryServices.AccountManagement;
using System.Threading.Tasks;
using Abp.Authorization.Users;
using Abp.Dependency;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.Zero.Ldap.Configuration;

namespace Abp.Zero.Ldap.Authentication
{
    /// <summary>
    /// Implements <see cref="IExternalAuthenticationSource{TUser}"/> to authenticate users from LDAP.
    /// Extend this class using application's User class as type parameter.
    /// Also, all needed methods can be overridden and changed upon your needs.
    /// </summary>
    /// <typeparam name="TUser">User type</typeparam>
    public abstract class LdapAuthenticationSource<TUser> :
        DefaultExternalAuthenticationSource<TUser>,
        ITransientDependency
        where TUser : AbpUserBase, new()
    {
        /// <summary>
        /// LDAP
        /// </summary>
        public const string SourceName = "LDAP";

        public override string Name => SourceName;

        private readonly ILdapSettings _settings;
        private readonly IAbpZeroLdapModuleConfig _ldapModuleConfig;

        protected LdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
        {
            _settings = settings;
            _ldapModuleConfig = ldapModuleConfig;
        }

        /// <inheritdoc/>
        public override async Task<bool> TryAuthenticateAsync(string userNameOrEmailAddress, string plainPassword)
        {
            // Multi-tenancy removed
            if (!_ldapModuleConfig.IsEnabled || !(await _settings.GetIsEnabled(null)))
            {
                return false;
            }

            using (var principalContext = await CreatePrincipalContext(userNameOrEmailAddress))
            {
                return ValidateCredentials(principalContext, userNameOrEmailAddress, plainPassword);
            }
        }

        /// <inheritdoc/>
        public override async Task<TUser> CreateUserAsync(string userNameOrEmailAddress)
        {
            // Multi-tenancy removed
            await CheckIsEnabled();

            var user = await base.CreateUserAsync(userNameOrEmailAddress);

            using (var principalContext = await CreatePrincipalContext(user))
            {
                var userPrincipal = FindUserPrincipalByIdentity(principalContext, userNameOrEmailAddress);

                if (userPrincipal == null)
                {
                    throw new AbpException("Unknown LDAP user: " + userNameOrEmailAddress);
                }

                UpdateUserFromPrincipal(user, userPrincipal);

                user.IsEmailConfirmed = true;
                user.IsActive = true;

                return user;
            }
        }

        public override async Task UpdateUserAsync(TUser user)
        {
            // Multi-tenancy removed
            await CheckIsEnabled();

            await base.UpdateUserAsync(user);

            using (var principalContext = await CreatePrincipalContext(user))
            {
                var userPrincipal = FindUserPrincipalByIdentity(principalContext, user.UserName);

                if (userPrincipal == null)
                {
                    throw new AbpException("Unknown LDAP user: " + user.UserName);
                }

                UpdateUserFromPrincipal(user, userPrincipal);
            }
        }

        protected virtual bool ValidateCredentials(PrincipalContext principalContext, string userNameOrEmailAddress,
            string plainPassword)
        {
            return principalContext.ValidateCredentials(userNameOrEmailAddress, plainPassword,
                ContextOptions.Negotiate);
        }

        protected virtual void UpdateUserFromPrincipal(TUser user, UserPrincipal userPrincipal)
        {
            user.UserName = GetUsernameFromUserPrincipal(userPrincipal);

            user.Name = userPrincipal.GivenName;
            user.Surname = userPrincipal.Surname;
            user.EmailAddress = userPrincipal.EmailAddress;

            if (userPrincipal.Enabled.HasValue)
            {
                user.IsActive = userPrincipal.Enabled.Value;
            }
        }

        protected virtual UserPrincipal FindUserPrincipalByIdentity(
            PrincipalContext principalContext,
            string userNameOrEmailAddress)
        {
            var userPrincipal =
                UserPrincipal.FindByIdentity(principalContext, IdentityType.SamAccountName, userNameOrEmailAddress) ??
                UserPrincipal.FindByIdentity(principalContext, IdentityType.UserPrincipalName, userNameOrEmailAddress);

            return userPrincipal;
        }

        protected virtual string GetUsernameFromUserPrincipal(UserPrincipal userPrincipal)
        {
            return userPrincipal.SamAccountName.IsNullOrEmpty()
                ? userPrincipal.UserPrincipalName
                : userPrincipal.SamAccountName;
        }

        protected virtual Task<PrincipalContext> CreatePrincipalContext(string userNameOrEmailAddress)
        {
            return CreatePrincipalContext();
        }

        protected virtual Task<PrincipalContext> CreatePrincipalContext(TUser user)
        {
            return CreatePrincipalContext();
        }

        protected virtual async Task<PrincipalContext> CreatePrincipalContext()
        {
            // Multi-tenancy removed
            var useSsl = await _settings.GetUseSsl(null);
            var contextType = await _settings.GetContextType(null);

            var options = useSsl
                ? ContextOptions.SecureSocketLayer | ContextOptions.Negotiate
                : GetDefaultOptionForStore(contextType);

            return new PrincipalContext(
                contextType,
                ConvertToNullIfEmpty(await _settings.GetDomain(null)),
                ConvertToNullIfEmpty(await _settings.GetContainer(null)),
                options,
                ConvertToNullIfEmpty(await _settings.GetUserName(null)),
                ConvertToNullIfEmpty(await _settings.GetPassword(null))
            );
        }

        private ContextOptions GetDefaultOptionForStore(ContextType contextType)
        {
            if (contextType == ContextType.Machine)
            {
                return ContextOptions.Negotiate;
            }

            return ContextOptions.Negotiate | ContextOptions.Signing | ContextOptions.Sealing;
        }

        protected virtual async Task CheckIsEnabled()
        {
            if (!_ldapModuleConfig.IsEnabled)
            {
                throw new AbpException("Ldap Authentication module is disabled globally!");
            }

            // Multi-tenancy removed
            if (!await _settings.GetIsEnabled(null))
            {
                throw new AbpException("Ldap Authentication is disabled! You can enable it by setting '" +
                                       LdapSettingNames.IsEnabled + "' to true");
            }
        }

        protected static string ConvertToNullIfEmpty(string str)
        {
            return str.IsNullOrWhiteSpace()
                ? null
                : str;
        }
    }
}
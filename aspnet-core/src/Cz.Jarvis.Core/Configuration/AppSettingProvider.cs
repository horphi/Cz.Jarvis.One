using System.Collections.Generic;
using System.Linq;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Json;
using Abp.Localization;
using Abp.Net.Mail;
using Abp.Zero.Configuration;
using Abp.Zero.Ldap.Configuration;
using Microsoft.Extensions.Configuration;
using Cz.Jarvis.Authentication;

namespace Cz.Jarvis.Configuration
{
    /// <summary>
    /// Defines settings for the application.
    /// See <see cref="AppSettings"/> for setting names.
    /// </summary>
    public class AppSettingProvider : SettingProvider
    {
        private readonly IConfigurationRoot _appConfiguration;
        VisibleSettingClientVisibilityProvider _visibleSettingClientVisibilityProvider;

        public AppSettingProvider(IAppConfigurationAccessor configurationAccessor)
        {
            _appConfiguration = configurationAccessor.Configuration;
            _visibleSettingClientVisibilityProvider = new VisibleSettingClientVisibilityProvider();
        }

        public override IEnumerable<SettingDefinition> GetSettingDefinitions(SettingDefinitionProviderContext context)
        {
            // Disable TwoFactorLogin by default (can be enabled by UI)
            context.Manager.GetSettingDefinition(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsEnabled)
                .DefaultValue = false.ToString().ToLowerInvariant();

            // Change scope of Email settings
            ChangeEmailSettingScopes(context);

            return GetHostSettings().Union(GetTenantSettings()).Union(GetSharedSettings())
                // theme settings
                .Union(GetExternalLoginProviderSettings())
                .Union(GetAdditionalLdapSettings());
        }

        private IEnumerable<SettingDefinition> GetAdditionalLdapSettings()
        {
            return new[]
            {
                new SettingDefinition(LdapSettingNames.UseSsl, "false", L("UseSsl"), scopes: SettingScopes.Application | SettingScopes.Tenant, isInherited: false, isEncrypted:false)
            };
        }

        private void ChangeEmailSettingScopes(SettingDefinitionProviderContext context)
        {
            if (!JarvisConsts.AllowTenantsToChangeEmailSettings)
            {
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.Host).Scopes = SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.Port).Scopes = SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.UserName).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.Password).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.Domain).Scopes = SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.EnableSsl).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.UseDefaultCredentials).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.DefaultFromAddress).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.DefaultFromDisplayName).Scopes =
                    SettingScopes.Application;
            }
        }

        private IEnumerable<SettingDefinition> GetHostSettings()
        {
            return new[]
            {
                new SettingDefinition(AppSettings.TenantManagement.AllowSelfRegistration,
                    GetFromAppSettings(AppSettings.TenantManagement.AllowSelfRegistration, "true"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.TenantManagement.IsNewRegisteredTenantActiveByDefault,
                    GetFromAppSettings(AppSettings.TenantManagement.IsNewRegisteredTenantActiveByDefault, "false")),
                new SettingDefinition(AppSettings.TenantManagement.UseCaptchaOnRegistration,
                    GetFromAppSettings(AppSettings.TenantManagement.UseCaptchaOnRegistration, "true"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.TenantManagement.UseCaptchaOnEmailActivation,
                    GetFromAppSettings(AppSettings.TenantManagement.UseCaptchaOnEmailActivation, "true"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.TenantManagement.UseCaptchaOnResetPassword,
                    GetFromAppSettings(AppSettings.TenantManagement.UseCaptchaOnResetPassword, "true"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.TenantManagement.DefaultEdition,
                    GetFromAppSettings(AppSettings.TenantManagement.DefaultEdition, "")),
                new SettingDefinition(AppSettings.UserManagement.SmsVerificationEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.SmsVerificationEnabled, "false"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.TenantManagement.SubscriptionExpireNotifyDayCount,
                    GetFromAppSettings(AppSettings.TenantManagement.SubscriptionExpireNotifyDayCount, "7"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.HostManagement.BillingLegalName,
                    GetFromAppSettings(AppSettings.HostManagement.BillingLegalName, "")),
                new SettingDefinition(AppSettings.HostManagement.BillingAddress,
                    GetFromAppSettings(AppSettings.HostManagement.BillingAddress, "")),
                new SettingDefinition(AppSettings.Recaptcha.SiteKey, GetFromSettings("Recaptcha:SiteKey"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UiManagement.Theme,
                    GetFromAppSettings(AppSettings.UiManagement.Theme, "default"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider,
                    scopes: SettingScopes.All),

                new SettingDefinition(AppSettings.UserManagement.Password.EnableCheckingLastXPasswordWhenPasswordChange,
                    GetFromAppSettings(AppSettings.UserManagement.Password.EnableCheckingLastXPasswordWhenPasswordChange, "false"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),

                new SettingDefinition(AppSettings.UserManagement.Password.CheckingLastXPasswordCount,
                    GetFromAppSettings(AppSettings.UserManagement.Password.CheckingLastXPasswordCount, "3"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),

                new SettingDefinition(AppSettings.UserManagement.Password.EnablePasswordExpiration,
                    GetFromAppSettings(AppSettings.UserManagement.Password.EnablePasswordExpiration, "false"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),

                new SettingDefinition(AppSettings.UserManagement.Password.PasswordExpirationDayCount,
                    GetFromAppSettings(AppSettings.UserManagement.Password.PasswordExpirationDayCount, "30"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),

                new SettingDefinition(AppSettings.UserManagement.Password.PasswordResetCodeExpirationHours,
                    GetFromAppSettings(AppSettings.UserManagement.Password.PasswordResetCodeExpirationHours, "24"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),

                new SettingDefinition(AppSettings.TenantManagement.IsRestrictedEmailDomainEnabled,
                    GetFromAppSettings(AppSettings.TenantManagement.IsRestrictedEmailDomainEnabled, "false"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
            };
        }

        private IEnumerable<SettingDefinition> GetTenantSettings()
        {
            return new[]
            {
                new SettingDefinition(AppSettings.UserManagement.AllowSelfRegistration,
                    GetFromAppSettings(AppSettings.UserManagement.AllowSelfRegistration, "true"),
                    scopes: SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.IsNewRegisteredUserActiveByDefault,
                    GetFromAppSettings(AppSettings.UserManagement.IsNewRegisteredUserActiveByDefault, "false"),
                    scopes: SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.UseCaptchaOnRegistration,
                    GetFromAppSettings(AppSettings.UserManagement.UseCaptchaOnRegistration, "true"),
                    scopes: SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.UseCaptchaOnEmailActivation,
                    GetFromAppSettings(AppSettings.UserManagement.UseCaptchaOnEmailActivation, "true"),
                    scopes: SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.UseCaptchaOnResetPassword,
                    GetFromAppSettings(AppSettings.UserManagement.UseCaptchaOnResetPassword, "true"),
                    scopes: SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.TenantManagement.BillingLegalName,
                    GetFromAppSettings(AppSettings.TenantManagement.BillingLegalName, ""),
                    scopes: SettingScopes.Tenant),
                new SettingDefinition(AppSettings.TenantManagement.BillingAddress,
                    GetFromAppSettings(AppSettings.TenantManagement.BillingAddress, ""), scopes: SettingScopes.Tenant),
                new SettingDefinition(AppSettings.TenantManagement.BillingTaxVatNo,
                    GetFromAppSettings(AppSettings.TenantManagement.BillingTaxVatNo, ""), scopes: SettingScopes.Tenant),
                new SettingDefinition(AppSettings.Email.UseHostDefaultEmailSettings,
                    GetFromAppSettings(AppSettings.Email.UseHostDefaultEmailSettings,
                        JarvisConsts.MultiTenancyEnabled ? "true" : "false"), scopes: SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.RestrictedEmailDomain,
                    GetFromAppSettings(AppSettings.UserManagement.RestrictedEmailDomain, ""),
                    scopes: SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.IsRestrictedEmailDomainEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.IsRestrictedEmailDomainEnabled, "false"),
                    scopes: SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
            };
        }

        private IEnumerable<SettingDefinition> GetSharedSettings()
        {
            return new[]
            {
                new SettingDefinition(AppSettings.UserManagement.TwoFactorLogin.IsGoogleAuthenticatorEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.TwoFactorLogin.IsGoogleAuthenticatorEnabled, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.IsCookieConsentEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.IsCookieConsentEnabled, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.PasswordlessLogin.IsEmailPasswordlessLoginEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.PasswordlessLogin.IsEmailPasswordlessLoginEnabled, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.PasswordlessLogin.IsSmsPasswordlessLoginEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.PasswordlessLogin.IsSmsPasswordlessLoginEnabled, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.IsQuickThemeSelectEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.IsQuickThemeSelectEnabled, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.UseCaptchaOnLogin,
                    GetFromAppSettings(AppSettings.UserManagement.UseCaptchaOnLogin, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, clientVisibilityProvider: _visibleSettingClientVisibilityProvider),
                new SettingDefinition(AppSettings.UserManagement.SessionTimeOut.IsEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.SessionTimeOut.IsEnabled, "false"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.SessionTimeOut.TimeOutSecond,
                    GetFromAppSettings(AppSettings.UserManagement.SessionTimeOut.TimeOutSecond, "30"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.SessionTimeOut.ShowTimeOutNotificationSecond,
                    GetFromAppSettings(AppSettings.UserManagement.SessionTimeOut.ShowTimeOutNotificationSecond, "30"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.SessionTimeOut.ShowLockScreenWhenTimedOut,
                    GetFromAppSettings(AppSettings.UserManagement.SessionTimeOut.ShowLockScreenWhenTimedOut, "false"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.AllowOneConcurrentLoginPerUser,
                    GetFromAppSettings(AppSettings.UserManagement.AllowOneConcurrentLoginPerUser, "false"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.AllowUsingGravatarProfilePicture,
                    GetFromAppSettings(AppSettings.UserManagement.AllowUsingGravatarProfilePicture, "false"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.UseGravatarProfilePicture,
                    GetFromAppSettings(AppSettings.UserManagement.UseGravatarProfilePicture, "false"),
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider, scopes: SettingScopes.User)
            };
        }

        private string GetFromAppSettings(string name, string defaultValue = null)
        {
            return GetFromSettings("App:" + name, defaultValue);
        }

        private string GetFromSettings(string name, string defaultValue = null)
        {
            return _appConfiguration[name] ?? defaultValue;
        }

       
        private IEnumerable<SettingDefinition> GetExternalLoginProviderSettings()
        {
            return GetFacebookExternalLoginProviderSettings()
                .Union(GetGoogleExternalLoginProviderSettings())
                .Union(GetTwitterExternalLoginProviderSettings())
                .Union(GetMicrosoftExternalLoginProviderSettings())
                .Union(GetOpenIdConnectExternalLoginProviderSettings())
                .Union(GetWsFederationExternalLoginProviderSettings());
        }

        private SettingDefinition[] GetFacebookExternalLoginProviderSettings()
        {
            string appId = GetFromSettings("Authentication:Facebook:AppId");
            string appSecret = GetFromSettings("Authentication:Facebook:AppSecret");

            var facebookExternalLoginProviderInfo = new FacebookExternalLoginProviderSettings()
            {
                AppId = appId,
                AppSecret = appSecret
            };

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.Facebook,
                    facebookExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Tenant.Facebook_IsDeactivated,
                    "false",
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider,
                    scopes: SettingScopes.Tenant
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.Facebook,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                )
            };
        }

        private SettingDefinition[] GetGoogleExternalLoginProviderSettings()
        {
            string clientId = GetFromSettings("Authentication:Google:ClientId");
            string clientSecret = GetFromSettings("Authentication:Google:ClientSecret");
            string userInfoEndPoint = GetFromSettings("Authentication:Google:UserInfoEndpoint");

            var googleExternalLoginProviderInfo = new GoogleExternalLoginProviderSettings()
            {
                ClientId = clientId,
                ClientSecret = clientSecret,
                UserInfoEndpoint = userInfoEndPoint
            };

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.Google,
                    googleExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Tenant.Google_IsDeactivated,
                    "false",
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider,
                    scopes: SettingScopes.Tenant
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.Google,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
            };
        }

        private SettingDefinition[] GetTwitterExternalLoginProviderSettings()
        {
            string consumerKey = GetFromSettings("Authentication:Twitter:ConsumerKey");
            string consumerSecret = GetFromSettings("Authentication:Twitter:ConsumerSecret");

            var twitterExternalLoginProviderInfo = new TwitterExternalLoginProviderSettings
            {
                ConsumerKey = consumerKey,
                ConsumerSecret = consumerSecret
            };

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.Twitter,
                    twitterExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Tenant.Twitter_IsDeactivated,
                    "false",
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider,
                    scopes: SettingScopes.Tenant
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.Twitter,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
            };
        }

        private SettingDefinition[] GetMicrosoftExternalLoginProviderSettings()
        {
            string consumerKey = GetFromSettings("Authentication:Microsoft:ConsumerKey");
            string consumerSecret = GetFromSettings("Authentication:Microsoft:ConsumerSecret");

            var microsoftExternalLoginProviderInfo = new MicrosoftExternalLoginProviderSettings()
            {
                ClientId = consumerKey,
                ClientSecret = consumerSecret
            };


            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.Microsoft,
                    microsoftExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Tenant.Microsoft_IsDeactivated,
                    "false",
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider,
                    scopes: SettingScopes.Tenant
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.Microsoft,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
            };
        }

        private SettingDefinition[] GetOpenIdConnectExternalLoginProviderSettings()
        {
            var clientId = GetFromSettings("Authentication:OpenId:ClientId");
            var clientSecret = GetFromSettings("Authentication:OpenId:ClientSecret");
            var authority = GetFromSettings("Authentication:OpenId:Authority");
            var loginUrl = GetFromSettings("Authentication:OpenId:LoginUrl");
            var validateIssuerStr = GetFromSettings("Authentication:OpenId:ValidateIssuer");
            var responseType = GetFromSettings("Authentication:OpenId:ResponseType");

            bool.TryParse(validateIssuerStr, out bool validateIssuer);

            var openIdConnectExternalLoginProviderInfo = new OpenIdConnectExternalLoginProviderSettings
            {
                ClientId = clientId,
                ClientSecret = clientSecret,
                Authority = authority,
                ValidateIssuer = validateIssuer,
                ResponseType = responseType
            };

            if (!loginUrl.IsNullOrEmpty())
            {
                openIdConnectExternalLoginProviderInfo.LoginUrl = loginUrl;
            }

            var jsonClaimMappings = new List<JsonClaimMapDto>();
            _appConfiguration.GetSection("Authentication:OpenId:ClaimsMapping").Bind(jsonClaimMappings);

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.OpenIdConnect,
                    openIdConnectExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Tenant.OpenIdConnect_IsDeactivated,
                    "false",
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider,
                    scopes: SettingScopes.Tenant
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.OpenIdConnect,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.OpenIdConnectMappedClaims,
                    jsonClaimMappings.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application | SettingScopes.Tenant
                )
            };
        }

        private SettingDefinition[] GetWsFederationExternalLoginProviderSettings()
        {
            var clientId = GetFromSettings("Authentication:WsFederation:ClientId");
            var wtrealm = GetFromSettings("Authentication:WsFederation:Wtrealm");
            var authority = GetFromSettings("Authentication:WsFederation:Authority");
            var tenant = GetFromSettings("Authentication:WsFederation:Tenant");
            var metaDataAddress = GetFromSettings("Authentication:WsFederation:MetaDataAddress");

            var wsFederationExternalLoginProviderInfo = new WsFederationExternalLoginProviderSettings()
            {
                ClientId = clientId,
                Tenant = tenant,
                Authority = authority,
                Wtrealm = wtrealm,
                MetaDataAddress = metaDataAddress
            };

            var jsonClaimMappings = new List<JsonClaimMapDto>();
            _appConfiguration.GetSection("Authentication:WsFederation:ClaimsMapping").Bind(jsonClaimMappings);

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.WsFederation,
                    wsFederationExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.WsFederation,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Tenant.WsFederation_IsDeactivated,
                    "false",
                    clientVisibilityProvider: _visibleSettingClientVisibilityProvider,
                    scopes: SettingScopes.Tenant
                ),
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.WsFederationMappedClaims,
                    jsonClaimMappings.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application | SettingScopes.Tenant
                )
            };
        }

        protected virtual ILocalizableString L(string name)
        {
            return new LocalizableString(name, JarvisConsts.LocalizationSourceName);
        }
    }
}

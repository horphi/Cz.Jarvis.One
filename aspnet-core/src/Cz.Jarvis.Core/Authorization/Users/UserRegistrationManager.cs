using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.IdentityFramework;
using Abp.Linq;
using Abp.Notifications;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.AspNetCore.Identity;
using Cz.Jarvis.Authorization.Roles;
using Cz.Jarvis.Configuration;
using Cz.Jarvis.Debugging;
using Cz.Jarvis.Notifications;

namespace Cz.Jarvis.Authorization.Users
{
    public class UserRegistrationManager : JarvisDomainServiceBase
    {
        public IAbpSession AbpSession { get; set; }
        public IAsyncQueryableExecuter AsyncQueryableExecuter { get; set; }

        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IUserEmailer _userEmailer;
        private readonly INotificationSubscriptionManager _notificationSubscriptionManager;
        private readonly IAppNotifier _appNotifier;

        public UserRegistrationManager(
            UserManager userManager,
            RoleManager roleManager,
            IUserEmailer userEmailer,
            INotificationSubscriptionManager notificationSubscriptionManager,
            IAppNotifier appNotifier)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userEmailer = userEmailer;
            _notificationSubscriptionManager = notificationSubscriptionManager;
            _appNotifier = appNotifier;
            AbpSession = NullAbpSession.Instance;
            AsyncQueryableExecuter = NullAsyncQueryableExecuter.Instance;
        }

        public async Task<User> RegisterAsync(string name, string surname, string emailAddress, string userName, string plainPassword, bool isEmailConfirmed, string emailActivationLink)
        {
            CheckForTenant();
            CheckSelfRegistrationIsEnabled();
            await CheckForEmailDomainAsync(emailAddress);

            var isNewRegisteredUserActiveByDefault = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.IsNewRegisteredUserActiveByDefault);
            var user = new User
            {
                Name = name,
                Surname = surname,
                EmailAddress = emailAddress,
                IsActive = isNewRegisteredUserActiveByDefault,
                UserName = userName,
                IsEmailConfirmed = isEmailConfirmed,
                Roles = new List<UserRole>()
            };

            user.SetNormalizedNames();

            var defaultRoles = await AsyncQueryableExecuter.ToListAsync(_roleManager.Roles.Where(r => r.IsDefault));
            foreach (var defaultRole in defaultRoles)
            {
                user.Roles.Add(new UserRole( user.Id, defaultRole.Id));
            }

            await _userManager.InitializeOptionsAsync(((int?)null));
            CheckErrors(await _userManager.CreateAsync(user, plainPassword));
            await CurrentUnitOfWork.SaveChangesAsync();

            if (!user.IsEmailConfirmed)
            {
                user.SetNewEmailConfirmationCode();
                await _userEmailer.SendEmailActivationLinkAsync(user, emailActivationLink);
            }

            //Notifications
            await _notificationSubscriptionManager.SubscribeToAllAvailableNotificationsAsync(user.ToUserIdentifier());
            await _appNotifier.WelcomeToTheApplicationAsync(user);
            await _appNotifier.NewUserRegisteredAsync(user);

            return user;
        }

        private void CheckForTenant()
        {
            if (!((int?)null).HasValue)
            {
                throw new InvalidOperationException("Can not register host users!");
            }
        }

        private void CheckSelfRegistrationIsEnabled()
        {
            if (!SettingManager.GetSettingValue<bool>(AppSettings.UserManagement.AllowSelfRegistration))
            {
                throw new UserFriendlyException(L("SelfUserRegistrationIsDisabledMessage_Detail"));
            }
        }

        private bool UseCaptchaOnRegistration()
        {
            return SettingManager.GetSettingValue<bool>(AppSettings.UserManagement.UseCaptchaOnRegistration);
        }

      
       
        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        private async Task CheckForEmailDomainAsync(string emailAddress)
        {
            if (await IsRestrictedEmailDomainAllEnabledAsync())
            {
                var restrictedEmailDomain = await SettingManager.GetSettingValueAsync(AppSettings.UserManagement.RestrictedEmailDomain);
                var emailDomain = emailAddress.Split('@')[1];

                if (!emailDomain.Equals(restrictedEmailDomain, StringComparison.OrdinalIgnoreCase) && 
                    restrictedEmailDomain != "")
                {
                    throw new UserFriendlyException(L("RestrictedEmailDomainInvalidMessage_Detail", emailAddress));
                }
            }
        }

        private async Task<bool> IsRestrictedEmailDomainAllEnabledAsync()
        {
            var isRestrictedEmailDomainEnabledForApplication = await SettingManager.GetSettingValueForApplicationAsync<bool>(
                AppSettings.TenantManagement.IsRestrictedEmailDomainEnabled);

            var isRestrictedEmailDomainEnabledForTenant = await SettingManager.GetSettingValueAsync<bool>(
                AppSettings.UserManagement.IsRestrictedEmailDomainEnabled);

            return isRestrictedEmailDomainEnabledForApplication && isRestrictedEmailDomainEnabledForTenant;
        }
    }
}

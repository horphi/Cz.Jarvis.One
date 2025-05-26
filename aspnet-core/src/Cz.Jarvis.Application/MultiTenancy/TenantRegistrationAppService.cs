using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Localization;
using Abp.Runtime.Session;
using Abp.Timing;
using Abp.UI;
using Abp.Zero.Configuration;
using Cz.Jarvis.Configuration;
using Cz.Jarvis.Debugging;
using Cz.Jarvis.MultiTenancy.Dto;
using Cz.Jarvis.Notifications;
using Cz.Jarvis.Security.Recaptcha;
using Cz.Jarvis.Url;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Extensions;
using Cz.Jarvis.ExtraProperties;

namespace Cz.Jarvis.MultiTenancy
{
    public class TenantRegistrationAppService : JarvisAppServiceBase, ITenantRegistrationAppService
    {
        public IAppUrlService AppUrlService { get; set; }

        private readonly IMultiTenancyConfig _multiTenancyConfig;
        private readonly IRecaptchaValidator _recaptchaValidator;
        private readonly IAppNotifier _appNotifier;
        private readonly ILocalizationContext _localizationContext;
        private readonly TenantManager _tenantManager;
        private readonly IWebUrlService _webUrlService;

        public TenantRegistrationAppService(
            IMultiTenancyConfig multiTenancyConfig,
            IRecaptchaValidator recaptchaValidator,
            IAppNotifier appNotifier,
            ILocalizationContext localizationContext,
            TenantManager tenantManager,
            IWebUrlService webUrlService)
        {
            _multiTenancyConfig = multiTenancyConfig;
            _recaptchaValidator = recaptchaValidator;
            _appNotifier = appNotifier;
            _localizationContext = localizationContext;
            _tenantManager = tenantManager;
            _webUrlService = webUrlService;
            AppUrlService = NullAppUrlService.Instance;
        }

        public async Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input)
        {

            using (CurrentUnitOfWork.SetTenantId(null))
            {
                CheckTenantRegistrationIsEnabled();

                if (UseCaptchaOnRegistration())
                {
                    await _recaptchaValidator.ValidateAsync(input.CaptchaResponse);
                }

                //Getting host-specific settings
                var isActive = await IsNewRegisteredTenantActiveByDefault();
                var isEmailConfirmationRequired = await SettingManager.GetSettingValueForApplicationAsync<bool>(
                    AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin
                );
                
                var tenantId = await _tenantManager.CreateWithAdminUserAsync(
                    input.TenancyName,
                    input.Name,
                    input.AdminPassword,
                    input.AdminEmailAddress,
                    null,
                    isActive,
                    shouldChangePasswordOnNextLogin: false,
                    sendActivationEmail: true,
                    AppUrlService.CreateEmailActivationUrlFormat(input.TenancyName),
                    adminName: input.AdminName,
                    adminSurname: input.AdminSurname
                );

                var tenant = await TenantManager.GetByIdAsync(tenantId);
                await _appNotifier.NewTenantRegisteredAsync(tenant);

                long? paymentId = null;
                
                return new RegisterTenantOutput
                {
                    TenantId = tenant.Id,
                    TenancyName = input.TenancyName,
                    Name = input.Name,
                    UserName = AbpUserBase.AdminUserName,
                    EmailAddress = input.AdminEmailAddress,
                    IsActive = tenant.IsActive,
                    IsEmailConfirmationRequired = isEmailConfirmationRequired,
                    IsTenantActive = tenant.IsActive,
                    PaymentId = paymentId
                };
            }
        }

        private async Task<bool> IsNewRegisteredTenantActiveByDefault()
        {
            return await SettingManager.GetSettingValueForApplicationAsync<bool>(AppSettings.TenantManagement
                .IsNewRegisteredTenantActiveByDefault);
        }

       
        private void CheckTenantRegistrationIsEnabled()
        {
            if (!IsSelfRegistrationEnabled())
            {
                throw new UserFriendlyException(L("SelfTenantRegistrationIsDisabledMessage_Detail"));
            }

            if (!_multiTenancyConfig.IsEnabled)
            {
                throw new UserFriendlyException(L("MultiTenancyIsNotEnabled"));
            }
        }

        private bool IsSelfRegistrationEnabled()
        {
            return SettingManager.GetSettingValueForApplication<bool>(
                AppSettings.TenantManagement.AllowSelfRegistration);
        }

        private bool UseCaptchaOnRegistration()
        {
            return SettingManager.GetSettingValueForApplication<bool>(AppSettings.TenantManagement
                .UseCaptchaOnRegistration);
        }

        
    }
}
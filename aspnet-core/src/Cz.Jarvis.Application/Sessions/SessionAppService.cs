using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Auditing;
using Abp.Runtime.Session;
using Microsoft.EntityFrameworkCore;
using Cz.Jarvis.Authentication.TwoFactor;
using Cz.Jarvis.Sessions.Dto;
using Cz.Jarvis.Authorization.Delegation;
using Cz.Jarvis.Authorization.Users;
using Abp.Domain.Uow;
using Abp.Localization;
using Cz.Jarvis.Authorization.PasswordlessLogin;
using Abp.Domain.Repositories;
using Abp.Authorization.Users;

namespace Cz.Jarvis.Sessions
{
    public class SessionAppService : JarvisAppServiceBase, ISessionAppService
    {
        private readonly IUserDelegationConfiguration _userDelegationConfiguration;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly ILocalizationContext _localizationContext;
        private readonly IRepository<UserLogin, long> _userLoginRepository;

        public SessionAppService(
            IUserDelegationConfiguration userDelegationConfiguration,
            IUnitOfWorkManager unitOfWorkManager,
            ILocalizationContext localizationContext,
            IRepository<UserLogin, long> userLoginRepository)
        {
            _userDelegationConfiguration = userDelegationConfiguration;
            _unitOfWorkManager = unitOfWorkManager;
            _localizationContext = localizationContext;
            _userLoginRepository = userLoginRepository;
        }

        [DisableAuditing]
        public async Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations()
        {
            return await _unitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                var output = new GetCurrentLoginInformationsOutput
                {
                    Application = new ApplicationInfoDto
                    {
                        Version = AppVersionHelper.Version,
                        ReleaseDate = AppVersionHelper.ReleaseDate,
                        Features = new Dictionary<string, bool>(),
                        Currency = JarvisConsts.Currency,
                        CurrencySign = JarvisConsts.CurrencySign,
                        UserDelegationIsEnabled = _userDelegationConfiguration.IsEnabled,
                        TwoFactorCodeExpireSeconds = TwoFactorCodeCacheItem.DefaultSlidingExpireTime.TotalSeconds,
                        PasswordlessLoginCodeExpireSeconds =
                            PasswordlessLoginCodeCacheItem.DefaultSlidingExpireTime.TotalSeconds,
                    }
                };

                if (AbpSession.UserId.HasValue)
                {
                    output.User = ObjectMapper.Map<UserLoginInfoDto>(await GetCurrentUserAsync());
                    output.User.LoginType = await GetUserLoginTypeAsync(output.User.Id);
                }

                if (AbpSession.ImpersonatorUserId.HasValue)
                {
                    output.ImpersonatorUser = ObjectMapper.Map<UserLoginInfoDto>(await GetImpersonatorUserAsync());
                }

                return output;
            });
        }


        public async Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken()
        {
            if (AbpSession.UserId <= 0)
            {
                throw new Exception(L("ThereIsNoLoggedInUser"));
            }

            var user = await UserManager.GetUserAsync(AbpSession.ToUserIdentifier());
            user.SetSignInToken();
            return new UpdateUserSignInTokenOutput
            {
                SignInToken = user.SignInToken,
                EncodedUserId = Convert.ToBase64String(Encoding.UTF8.GetBytes(user.Id.ToString()))
            };
        }

        protected virtual async Task<User> GetImpersonatorUserAsync()
        {
            var user = await UserManager.FindByIdAsync(AbpSession.ImpersonatorUserId.ToString());
            if (user == null)
            {
                throw new Exception("User not found!");
            }

            return user;
        }

        private async Task<LoginType> GetUserLoginTypeAsync(long userId)
        {
            if (await UserHasLoginRecordAAsync(userId))
            {
                return LoginType.External;
            }

            return LoginType.Local;
        }

        private async Task<bool> UserHasLoginRecordAAsync(long userId)
        {
            var query = await _userLoginRepository.GetAllAsync();
            var user = await query
                .AnyAsync(x => x.UserId == userId);
            return user;
        }
    }
}
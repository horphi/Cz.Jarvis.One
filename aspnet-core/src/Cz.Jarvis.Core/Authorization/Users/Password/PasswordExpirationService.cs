using System;
using System.Linq;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Timing;
using Cz.Jarvis.Configuration;

namespace Cz.Jarvis.Authorization.Users.Password
{
    public class PasswordExpirationService : JarvisDomainServiceBase, IPasswordExpirationService
    {
        private readonly IRepository<RecentPassword, Guid> _recentPasswordRepository;
        private readonly IUserRepository _userRepository;

        public PasswordExpirationService(
            IRepository<RecentPassword, Guid> recentPasswordRepository,
            IUserRepository userRepository)
        {
            _recentPasswordRepository = recentPasswordRepository;
            _userRepository = userRepository;
        }

        public void ForcePasswordExpiredUsersToChangeTheirPassword()
        {
            var isEnabled = SettingManager.GetSettingValueForApplication<bool>(
                AppSettings.UserManagement.Password.EnablePasswordExpiration
            );

            if (!isEnabled)
            {
                return;
            }

            // check host users 

            // Multi-tenancy removed - process all users in single database
            ForcePasswordExpiredUsersToChangeTheirPasswordInternal();
        }

        private void ForcePasswordExpiredUsersToChangeTheirPasswordInternal()
        {
            var passwordExpirationDayCount = SettingManager.GetSettingValueForApplication<int>(
                AppSettings.UserManagement.Password.PasswordExpirationDayCount
            );

            var passwordExpireDate = Clock.Now.AddDays(-passwordExpirationDayCount).ToUniversalTime();

            // TODO: Query seems wrong !
            var passwordExpiredUsers = _userRepository.GetPasswordExpiredUserIds(passwordExpireDate);

            var separationCount = 1000;
            var separationLoopCount = passwordExpiredUsers.Count / separationCount + 1;

            for (int i = 0; i < separationLoopCount; i++)
            {
                var userIdsToUpdate = passwordExpiredUsers.Skip(i * separationCount).Take(separationCount).ToList();
                if (userIdsToUpdate.Count > 0)
                {
                    _userRepository.UpdateUsersToChangePasswordOnNextLogin(userIdsToUpdate);
                }
            }

        }
    }
}

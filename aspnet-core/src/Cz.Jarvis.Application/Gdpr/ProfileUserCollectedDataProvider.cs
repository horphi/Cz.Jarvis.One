using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp;
using Cz.AspNetJarvisCore.Net;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.Localization;
using Cz.Jarvis.Authorization.Users;
using Cz.Jarvis.Dto;
using Cz.Jarvis.Storage;

namespace Cz.Jarvis.Gdpr
{
    public class ProfileUserCollectedDataProvider : IUserCollectedDataProvider, ITransientDependency
    {
        private readonly UserManager _userManager;
        private readonly ITempFileCacheManager _tempFileCacheManager;
        private readonly ILocalizationManager _localizationManager;

        public ProfileUserCollectedDataProvider(
            UserManager userManager,
            ITempFileCacheManager tempFileCacheManager,
            ILocalizationManager localizationManager)
        {
            _userManager = userManager;
            _tempFileCacheManager = tempFileCacheManager;
            _localizationManager = localizationManager;
        }

        public async Task<List<FileDto>> GetFiles(UserIdentifier user)
        {
            var profileInfo = await _userManager.GetUserByIdAsync(user.UserId);

            var content = new List<string>
            {
                L("UserName") +": " + profileInfo.UserName,
                L("Name") +": " + profileInfo.Name,
                L("Surname") +": " + profileInfo.Surname,
                L("EmailAddress") +": " + profileInfo.EmailAddress,
                L("PhoneNumber") +": " + profileInfo.PhoneNumber
            };

            var profileInfoBytes = Encoding.UTF8.GetBytes(string.Join("\n\r", content));

            var file = new FileDto("ProfileInfo.txt", MimeTypeNames.TextPlain);
            _tempFileCacheManager.SetFile(file.FileToken, profileInfoBytes);

            return new List<FileDto> { file };
        }

        private string L(string name)
        {
            return _localizationManager.GetString(JarvisConsts.LocalizationSourceName, name);
        }
    }
}
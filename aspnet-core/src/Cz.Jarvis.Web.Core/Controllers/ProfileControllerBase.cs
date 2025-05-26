using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Cz.AspNetJarvisCore.Net;
using Abp.Extensions;
using Abp.IO.Extensions;
using Abp.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cz.Jarvis.Authorization.Users.Profile;
using Cz.Jarvis.Dto;
using Cz.Jarvis.Graphics;
using Cz.Jarvis.Storage;

namespace Cz.Jarvis.Web.Controllers
{
    public abstract class ProfileControllerBase : JarvisControllerBase
    {
        private readonly ITempFileCacheManager _tempFileCacheManager;
        private readonly IProfileAppService _profileAppService;
        private readonly IImageValidator _imageValidator;
        
        private const int MaxProfilePictureSize = 5242880; //5MB

        protected ProfileControllerBase(
            ITempFileCacheManager tempFileCacheManager,
            IProfileAppService profileAppService, 
            IImageValidator imageValidator)
        {
            _tempFileCacheManager = tempFileCacheManager;
            _profileAppService = profileAppService;
            _imageValidator = imageValidator;
        }
        
        public void UploadProfilePicture(FileDto input)
        {
            var profilePictureFile = Request.Form.Files.First();

            //Check input
            if (profilePictureFile == null)
            {
                throw new UserFriendlyException(L("ProfilePicture_Change_Error"));
            }

            if (profilePictureFile.Length > MaxProfilePictureSize)
            {
                throw new UserFriendlyException(L("ProfilePicture_Warn_SizeLimit",
                    AppConsts.MaxProfilePictureBytesUserFriendlyValue));
            }

            byte[] fileBytes;
            using (var stream = profilePictureFile.OpenReadStream())
            {
                fileBytes = stream.GetAllBytes();
                _imageValidator.Validate(fileBytes);
            }

            _tempFileCacheManager.SetFile(input.FileToken, fileBytes);
        }

        [AllowAnonymous]
        public FileResult GetDefaultProfilePicture()
        {
            return GetDefaultProfilePictureInternal();
        }

        public async Task<FileResult> GetProfilePictureByUser(long userId)
        {
            var output = await _profileAppService.GetProfilePictureByUser(userId);
            if (output.ProfilePicture.IsNullOrEmpty())
            {
                return GetDefaultProfilePictureInternal();
            }

            return File(Convert.FromBase64String(output.ProfilePicture), MimeTypeNames.ImageJpeg);
        }

        protected FileResult GetDefaultProfilePictureInternal()
        {
            return File(Path.Combine("Common", "Images", "default-profile-picture.png"), MimeTypeNames.ImagePng);
        }
    }
}
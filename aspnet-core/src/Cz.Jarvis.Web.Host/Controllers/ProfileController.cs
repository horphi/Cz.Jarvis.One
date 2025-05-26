using Abp.AspNetCore.Mvc.Authorization;
using Cz.Jarvis.Authorization.Users.Profile;
using Cz.Jarvis.Graphics;
using Cz.Jarvis.Storage;

namespace Cz.Jarvis.Web.Controllers
{
    [AbpMvcAuthorize]
    public class ProfileController : ProfileControllerBase
    {
        public ProfileController(
            ITempFileCacheManager tempFileCacheManager,
            IProfileAppService profileAppService,
            IImageValidator imageValidator) :
            base(tempFileCacheManager, profileAppService, imageValidator)
        {
        }
    }
}
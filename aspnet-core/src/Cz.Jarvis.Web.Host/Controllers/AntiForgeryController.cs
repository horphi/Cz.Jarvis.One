using Microsoft.AspNetCore.Antiforgery;

namespace Cz.Jarvis.Web.Controllers
{
    public class AntiForgeryController : JarvisControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }
    }
}

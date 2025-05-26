using System.Threading.Tasks;
using Cz.Jarvis.Security.Recaptcha;

namespace Cz.Jarvis.Test.Base.Web
{
    public class FakeRecaptchaValidator : IRecaptchaValidator
    {
        public Task ValidateAsync(string captchaResponse)
        {
            return Task.CompletedTask;
        }
    }
}

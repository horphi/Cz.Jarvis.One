using System.Threading.Tasks;

namespace Cz.Jarvis.Security.Recaptcha
{
    public interface IRecaptchaValidator
    {
        Task ValidateAsync(string captchaResponse);
    }
}
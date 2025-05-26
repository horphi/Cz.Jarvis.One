using System.Threading.Tasks;
using Cz.Jarvis.Authorization.Users;

namespace Cz.Jarvis.WebHooks
{
    public interface IAppWebhookPublisher
    {
        Task PublishTestWebhook();
    }
}

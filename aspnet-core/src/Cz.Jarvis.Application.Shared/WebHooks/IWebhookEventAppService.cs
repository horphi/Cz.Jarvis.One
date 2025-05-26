using System.Threading.Tasks;
using Abp.Webhooks;

namespace Cz.Jarvis.WebHooks
{
    public interface IWebhookEventAppService
    {
        Task<WebhookEvent> Get(string id);
    }
}

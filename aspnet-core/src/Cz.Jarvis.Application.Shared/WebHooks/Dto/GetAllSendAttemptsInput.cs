using Cz.Jarvis.Dto;

namespace Cz.Jarvis.WebHooks.Dto
{
    public class GetAllSendAttemptsInput : PagedInputDto
    {
        public string SubscriptionId { get; set; }
    }
}

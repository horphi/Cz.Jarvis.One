using Abp.Application.Services.Dto;

namespace Cz.Jarvis.Notifications.Dto
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}
using System;
using Abp.Notifications;
using Cz.Jarvis.Dto;

namespace Cz.Jarvis.Notifications.Dto
{
    public class GetUserNotificationsInput : PagedInputDto
    {
        public UserNotificationState? State { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
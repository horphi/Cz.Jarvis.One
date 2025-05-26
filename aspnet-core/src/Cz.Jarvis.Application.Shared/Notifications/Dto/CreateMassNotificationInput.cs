using Abp.Notifications;

namespace Cz.Jarvis.Notifications.Dto
{
    public class CreateMassNotificationInput
    {
        public string Message { get; set; }

        public NotificationSeverity Severity { get; set; }

        public long[] UserIds { get; set; }
        
        public string[] TargetNotifiers { get; set; }
    }
}
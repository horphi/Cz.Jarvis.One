using Abp.Auditing;
using Cz.Jarvis.Configuration.Dto;

namespace Cz.Jarvis.Configuration.Tenants.Dto
{
    public class TenantEmailSettingsEditDto : EmailSettingsEditDto
    {
        public bool UseHostDefaultEmailSettings { get; set; }
    }
}
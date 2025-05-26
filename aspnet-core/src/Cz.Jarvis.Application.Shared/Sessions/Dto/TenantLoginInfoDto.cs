using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.Timing;

namespace Cz.Jarvis.Sessions.Dto
{
    public class TenantLoginInfoDto : EntityDto
    {
        public string TenancyName { get; set; }

        public string Name { get; set; }

        public virtual Guid? DarkLogoId { get; set; }

        public virtual string DarkLogoFileType { get; set; }
        
        public virtual Guid? DarkLogoMinimalId { get; set; }

        public virtual string DarkLogoMinimalFileType { get; set; }
        
        public virtual Guid? LightLogoId { get; set; }

        public virtual string LightLogoFileType { get; set; }
        
        public virtual Guid? LightLogoMinimalId { get; set; }

        public virtual string LightLogoMinimalFileType { get; set; }

        public Guid? CustomCssId { get; set; }
        
        public DateTime CreationTime { get; set; }

        
        public string SubscriptionDateString { get; set; }

        public string CreationTimeString { get; set; }
        
        public virtual bool HasLogo()
        {
            return (DarkLogoId != null && DarkLogoFileType != null) ||
                   (LightLogoId != null && LightLogoFileType != null);
        }
    }
}

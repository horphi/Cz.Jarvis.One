﻿using System;
using System.ComponentModel.DataAnnotations;
using Abp.MultiTenancy;
using Abp.Timing;
using Cz.Jarvis.Authorization.Users;

namespace Cz.Jarvis.MultiTenancy
{
    /// <summary>
    /// Represents a Tenant in the system.
    /// A tenant is a isolated customer for the application
    /// which has it's own users, roles and other application entities.
    /// </summary>
    public class Tenant : AbpTenant<User>
    {
        public const int MaxLogoMimeTypeLength = 64;

        public virtual Guid? CustomCssId { get; set; }

        public virtual Guid? DarkLogoId { get; set; }

        [MaxLength(MaxLogoMimeTypeLength)]
        public virtual string DarkLogoFileType { get; set; }
        
        public virtual Guid? DarkLogoMinimalId { get; set; }

        [MaxLength(MaxLogoMimeTypeLength)]
        public virtual string DarkLogoMinimalFileType { get; set; }
        
        public virtual Guid? LightLogoId { get; set; }

        [MaxLength(MaxLogoMimeTypeLength)]
        public virtual string LightLogoFileType { get; set; }
        
        public virtual Guid? LightLogoMinimalId { get; set; }

        [MaxLength(MaxLogoMimeTypeLength)]
        public virtual string LightLogoMinimalFileType { get; set; }


        protected Tenant()
        {

        }

        public Tenant(string tenancyName, string name)
            : base(tenancyName, name)
        {

        }

        public virtual bool HasLogo()
        {
            return (DarkLogoId != null && DarkLogoFileType != null) ||
                   (LightLogoId != null && LightLogoFileType != null) ||
                   (DarkLogoMinimalId != null && DarkLogoMinimalFileType != null) ||
                   (LightLogoMinimalId != null && LightLogoMinimalFileType != null);
        }
        
        public virtual bool HasDarkLogo()
        {
            return DarkLogoId != null && DarkLogoFileType != null;
        }     
        
        public virtual bool HasLightLogo()
        {
            return LightLogoId != null && LightLogoFileType != null;
        }
        
        public bool HasLightLogoMinimal()
        {
            return LightLogoMinimalId != null && LightLogoMinimalFileType != null;
        }

        public bool HasDarkLogoMinimal()
        {
            return DarkLogoMinimalId != null && DarkLogoMinimalFileType != null;
        }

        public void ClearDarkLogo()
        {
            DarkLogoId = null;
            DarkLogoFileType = null;
        }
        
        public void ClearLightLogo()
        {
            LightLogoId = null;
            LightLogoFileType = null;
        }
        
        public void ClearDarkLogoMinimal()
        {
            DarkLogoMinimalId = null;
            DarkLogoMinimalFileType = null;
        }
        
        public void ClearLightLogoMinimal()
        {
            LightLogoMinimalId = null;
            LightLogoMinimalFileType = null;
        }

        
    }
}
﻿using System.ComponentModel.DataAnnotations;
using Abp.Authorization.Users;

namespace Cz.Jarvis.Configuration.Host.Dto
{
    public class SendTestEmailInput
    {
        [Required]
        [MaxLength(AbpUserBase.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }
    }
}
﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Cz.Jarvis.Authorization.Roles.Dto
{
    public class CreateOrUpdateRoleInput
    {
        [Required]
        public RoleEditDto Role { get; set; }

        [Required]
        public List<string> GrantedPermissionNames { get; set; }
    }
}
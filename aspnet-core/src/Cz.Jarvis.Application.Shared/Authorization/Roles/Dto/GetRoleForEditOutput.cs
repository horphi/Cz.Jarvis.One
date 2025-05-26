using System.Collections.Generic;
using Cz.Jarvis.Authorization.Permissions.Dto;

namespace Cz.Jarvis.Authorization.Roles.Dto
{
    public class GetRoleForEditOutput
    {
        public RoleEditDto Role { get; set; }

        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}
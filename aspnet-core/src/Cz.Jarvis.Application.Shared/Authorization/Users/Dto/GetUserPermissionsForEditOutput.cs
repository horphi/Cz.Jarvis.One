using System.Collections.Generic;
using Cz.Jarvis.Authorization.Permissions.Dto;

namespace Cz.Jarvis.Authorization.Users.Dto
{
    public class GetUserPermissionsForEditOutput
    {
        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}
using Abp.Authorization;
using Cz.Jarvis.Authorization.Roles;
using Cz.Jarvis.Authorization.Users;

namespace Cz.Jarvis.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}

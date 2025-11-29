using Abp.Authorization.Roles;
using Cz.Jarvis.Authorization.Users;

namespace Cz.Jarvis.Authorization.Roles
{
    /// <summary>
    /// Represents a role in the system.
    /// </summary>
    public class Role : AbpRole<User>
    {
        //Can add application specific role properties here

        public Role()
        {

        }

        public Role(string displayName)
            : base(null, displayName)
        {

        }

        public Role(string name, string displayName)
            : base(name, displayName)
        {

        }
    }
}

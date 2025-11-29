using System;
using Abp.Authorization.Users;

namespace Abp.Runtime.Session
{
    public static class AbpSessionExtensions
    {
        public static bool IsUser(this IAbpSession session, AbpUserBase user)
        {
            if (session == null)
            {
                throw new ArgumentNullException(nameof(session));
            }

            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            // Multi-tenancy removed - only check UserId
            return session.UserId.HasValue &&
                session.UserId.Value == user.Id;
        }
    }
}

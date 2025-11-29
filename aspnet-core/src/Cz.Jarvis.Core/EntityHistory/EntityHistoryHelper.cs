using System;
using System.Linq;
using Cz.Jarvis.Authorization.Roles;

namespace Cz.Jarvis.EntityHistory
{
    public static class EntityHistoryHelper
    {
        public const string EntityHistoryConfigurationName = "EntityHistory";

        public static readonly Type[] HostSideTrackedTypes =
        {
             typeof(Role)
        };

        public static readonly Type[] TenantSideTrackedTypes =
        {
            typeof(Role)
        };

        public static readonly Type[] TrackedTypes =
            HostSideTrackedTypes
                .Concat(TenantSideTrackedTypes)
                .GroupBy(type => type.FullName)
                .Select(types => types.First())
                .ToArray();
    }
}

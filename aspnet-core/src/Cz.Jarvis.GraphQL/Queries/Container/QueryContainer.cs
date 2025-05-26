using Abp.Dependency;
using GraphQL.Types;

namespace Cz.Jarvis.Queries.Container
{
    public sealed class QueryContainer : ObjectGraphType, ITransientDependency
    {
        public QueryContainer(RoleQuery roleQuery, UserQuery userQuery)
        {
            AddField(roleQuery.GetFieldType());
            
            AddField(userQuery.GetFieldType());
        }
    }
}
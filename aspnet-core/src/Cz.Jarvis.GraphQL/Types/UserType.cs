using GraphQL.Types;
using Cz.Jarvis.Dto;

namespace Cz.Jarvis.Types
{
    public class UserType : ObjectGraphType<UserDto>
    {
        public static class ChildFields
        {
            public const string Items = "items";
            public const string Roles = "roles";

            public static string GetFieldSelector(string childField)
            {
                return string.Concat(Items, ":", childField);
            }
        }

        public UserType()
        {
            Name = "UserType";
            Field(x => x.Id);
            Field(x => x.Name);
            Field(x => x.Surname);
            Field(x => x.UserName);
            Field(x => x.EmailAddress);
            Field(x => x.PhoneNumber, nullable: true);
            Field(x => x.IsActive);
            Field(x => x.IsEmailConfirmed);
            Field(x => x.CreationTime);
            Field(x => x.TenantId, nullable: true);
            Field(x => x.ProfilePictureId, nullable: true, type: typeof(StringGraphType));
            Field<ListGraphType<RoleType>>(ChildFields.Roles);
        }

        public class RoleType : ObjectGraphType<UserDto.RoleDto>
        {
            public RoleType()
            {
                Name = "UserRoleType";
                
                Field(x => x.Id);
                Field(x => x.Name);
                Field(x => x.DisplayName);
            }
        }
        
    }
}

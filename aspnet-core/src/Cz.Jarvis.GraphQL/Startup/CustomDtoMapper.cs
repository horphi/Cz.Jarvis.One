using AutoMapper;
using Cz.Jarvis.Authorization.Users;
using Cz.Jarvis.Dto;

namespace Cz.Jarvis.Startup
{
    public static class CustomDtoMapper
    {
        public static void CreateMappings(IMapperConfigurationExpression configuration)
        {
            configuration.CreateMap<User, UserDto>()
                .ForMember(dto => dto.Roles, options => options.Ignore());
        }
    }
}
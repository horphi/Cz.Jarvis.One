using Abp.Auditing;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.DynamicEntityProperties;
using Abp.EntityHistory;
using Abp.Extensions;
using Abp.Localization;
using Abp.Notifications;
using Abp.UI.Inputs;
using Abp.Webhooks;
using AutoMapper;
using Cz.Jarvis.Auditing.Dto;
using Cz.Jarvis.Authorization.Accounts.Dto;
using Cz.Jarvis.Authorization.Delegation;
using Cz.Jarvis.Authorization.Permissions.Dto;
using Cz.Jarvis.Authorization.Roles;
using Cz.Jarvis.Authorization.Roles.Dto;
using Cz.Jarvis.Authorization.Users;
using Cz.Jarvis.Authorization.Users.Delegation.Dto;
using Cz.Jarvis.Authorization.Users.Dto;
using Cz.Jarvis.Authorization.Users.Importing.Dto;
using Cz.Jarvis.Authorization.Users.Profile.Dto;
using Cz.Jarvis.Chat;
using Cz.Jarvis.Chat.Dto;
using Cz.Jarvis.Common.Dto;
using Cz.Jarvis.DynamicEntityProperties.Dto;
using Cz.Jarvis.EntityChanges;
using Cz.Jarvis.EntityChanges.Dto;
using Cz.Jarvis.Friendships;
using Cz.Jarvis.Friendships.Cache;
using Cz.Jarvis.Friendships.Dto;
using Cz.Jarvis.Localization.Dto;
using Cz.Jarvis.Notifications.Dto;
using Cz.Jarvis.Sessions.Dto;
using Cz.Jarvis.WebHooks.Dto;

namespace Cz.Jarvis
{
    internal static class CustomDtoMapper
    {
        public static void CreateMappings(IMapperConfigurationExpression configuration)
        {
            
            //Chat
            configuration.CreateMap<ChatMessage, ChatMessageDto>();
            configuration.CreateMap<ChatMessage, ChatMessageExportDto>();
            
            //Role
            configuration.CreateMap<RoleEditDto, Role>().ReverseMap();
            configuration.CreateMap<Role, RoleListDto>();
            configuration.CreateMap<UserRole, UserListRoleDto>();
            
            //Permission
            configuration.CreateMap<Permission, FlatPermissionDto>();
            configuration.CreateMap<Permission, FlatPermissionWithLevelDto>();

            //Language
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageListDto>();
            configuration.CreateMap<NotificationDefinition, NotificationSubscriptionWithDisplayNameDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>()
                .ForMember(ldto => ldto.IsEnabled, options => options.MapFrom(l => !l.IsDisabled));

         
            //User
            configuration.CreateMap<User, UserEditDto>()
                .ForMember(dto => dto.Password, options => options.Ignore())
                .ReverseMap()
                .ForMember(user => user.Password, options => options.Ignore());
            configuration.CreateMap<User, UserLoginInfoDto>();
            configuration.CreateMap<User, UserListDto>();
            configuration.CreateMap<User, ChatUserDto>();
            configuration.CreateMap<CurrentUserProfileEditDto, User>().ReverseMap();
            configuration.CreateMap<UserLoginAttemptDto, UserLoginAttempt>().ReverseMap();
            configuration.CreateMap<ImportUserDto, User>().ForMember(x => x.Roles, options => options.Ignore());
            configuration.CreateMap<User, FindUsersOutputDto>();

            //AuditLog
            configuration.CreateMap<AuditLog, AuditLogListDto>();

            //EntityChanges
            configuration.CreateMap<EntityChange, EntityChangeListDto>();
            configuration.CreateMap<EntityChange, EntityAndPropertyChangeListDto>();
            configuration.CreateMap<EntityPropertyChange, EntityPropertyChangeDto>();
            configuration.CreateMap<EntityChangePropertyAndUser, EntityChangeListDto>();

            //Friendship
            configuration.CreateMap<Friendship, FriendDto>();
            configuration.CreateMap<FriendCacheItem, FriendDto>();
            
            //Webhooks
            configuration.CreateMap<WebhookSubscription, GetAllSubscriptionsOutput>();
            configuration.CreateMap<WebhookSendAttempt, GetAllSendAttemptsOutput>()
                .ForMember(webhookSendAttemptListDto => webhookSendAttemptListDto.WebhookName,
                    options => options.MapFrom(l => l.WebhookEvent.WebhookName))
                .ForMember(webhookSendAttemptListDto => webhookSendAttemptListDto.Data,
                    options => options.MapFrom(l => l.WebhookEvent.Data));

            configuration.CreateMap<WebhookSendAttempt, GetAllSendAttemptsOfWebhookEventOutput>();

            configuration.CreateMap<DynamicProperty, DynamicPropertyDto>().ReverseMap();
            configuration.CreateMap<DynamicPropertyValue, DynamicPropertyValueDto>().ReverseMap();
            configuration.CreateMap<DynamicEntityProperty, DynamicEntityPropertyDto>()
                .ForMember(dto => dto.DynamicPropertyName,
                    options => options.MapFrom(entity =>
                        entity.DynamicProperty.DisplayName.IsNullOrEmpty()
                            ? entity.DynamicProperty.PropertyName
                            : entity.DynamicProperty.DisplayName));
            configuration.CreateMap<DynamicEntityPropertyDto, DynamicEntityProperty>();

            configuration.CreateMap<DynamicEntityPropertyValue, DynamicEntityPropertyValueDto>().ReverseMap();

            //User Delegations
            configuration.CreateMap<CreateUserDelegationDto, UserDelegation>();

            /* ADD YOUR OWN CUSTOM AUTOMAPPER MAPPINGS HERE */
        }
    }
}
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Cz.Jarvis.Authorization.Permissions.Dto;

namespace Cz.Jarvis.Authorization.Permissions
{
    public interface IPermissionAppService : IApplicationService
    {
        ListResultDto<FlatPermissionWithLevelDto> GetAllPermissions();
    }
}

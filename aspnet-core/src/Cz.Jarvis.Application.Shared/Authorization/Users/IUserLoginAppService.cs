using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Cz.Jarvis.Authorization.Users.Dto;

namespace Cz.Jarvis.Authorization.Users
{
    public interface IUserLoginAppService : IApplicationService
    {
        Task<PagedResultDto<UserLoginAttemptDto>> GetUserLoginAttempts(GetLoginAttemptsInput input);
        Task<string> GetExternalLoginProviderNameByUser(long userId);
    }
}

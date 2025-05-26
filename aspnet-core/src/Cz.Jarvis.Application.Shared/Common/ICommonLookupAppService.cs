using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Cz.Jarvis.Common.Dto;

namespace Cz.Jarvis.Common
{
    public interface ICommonLookupAppService : IApplicationService
    {
        Task<PagedResultDto<FindUsersOutputDto>> FindUsers(FindUsersInput input);
    }
}
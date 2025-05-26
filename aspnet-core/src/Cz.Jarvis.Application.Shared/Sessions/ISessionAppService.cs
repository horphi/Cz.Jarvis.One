using System.Threading.Tasks;
using Abp.Application.Services;
using Cz.Jarvis.Sessions.Dto;

namespace Cz.Jarvis.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();

        Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken();
    }
}

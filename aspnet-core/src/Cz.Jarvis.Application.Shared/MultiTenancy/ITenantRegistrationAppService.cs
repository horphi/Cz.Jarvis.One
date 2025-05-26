using System.Threading.Tasks;
using Abp.Application.Services;
using Cz.Jarvis.MultiTenancy.Dto;

namespace Cz.Jarvis.MultiTenancy
{
    public interface ITenantRegistrationAppService: IApplicationService
    {
        Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input);
    }
}
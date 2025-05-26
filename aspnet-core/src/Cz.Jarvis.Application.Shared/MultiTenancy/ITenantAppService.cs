using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Cz.Jarvis.MultiTenancy.Dto;

namespace Cz.Jarvis.MultiTenancy
{
    public interface ITenantAppService : IApplicationService
    {
        Task<PagedResultDto<TenantListDto>> GetTenants(GetTenantsInput input);

        Task CreateTenant(CreateTenantInput input);

        Task<TenantEditDto> GetTenantForEdit(EntityDto input);

        Task UpdateTenant(TenantEditDto input);

        Task DeleteTenant(EntityDto input);
        
        Task UnlockTenantAdmin(EntityDto input);
    }
}

using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Cz.Jarvis.EntityChanges.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cz.Jarvis.EntityChanges
{
    public interface IEntityChangeAppService : IApplicationService
    {
        Task<ListResultDto<EntityAndPropertyChangeListDto>> GetEntityChangesByEntity(GetEntityChangesByEntityInput input);
    }
}

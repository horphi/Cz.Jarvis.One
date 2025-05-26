using System.Threading.Tasks;
using Abp.Application.Services;
using Cz.Jarvis.Configuration.Host.Dto;

namespace Cz.Jarvis.Configuration.Host
{
    public interface IHostSettingsAppService : IApplicationService
    {
        Task<HostSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(HostSettingsEditDto input);

        Task SendTestEmail(SendTestEmailInput input);
    }
}

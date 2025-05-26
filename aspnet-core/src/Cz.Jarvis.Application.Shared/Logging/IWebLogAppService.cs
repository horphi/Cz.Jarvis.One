using Abp.Application.Services;
using Cz.Jarvis.Dto;
using Cz.Jarvis.Logging.Dto;

namespace Cz.Jarvis.Logging
{
    public interface IWebLogAppService : IApplicationService
    {
        GetLatestWebLogsOutput GetLatestWebLogs();

        FileDto DownloadWebLogs();
    }
}

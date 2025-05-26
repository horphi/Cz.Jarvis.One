using System.Threading.Tasks;
using Cz.Jarvis.Sessions.Dto;

namespace Cz.Jarvis.Web.Session
{
    public interface IPerRequestSessionCache
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformationsAsync();
    }
}

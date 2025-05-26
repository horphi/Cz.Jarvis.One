using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using Cz.Jarvis.Dto;

namespace Cz.Jarvis.Gdpr
{
    public interface IUserCollectedDataProvider
    {
        Task<List<FileDto>> GetFiles(UserIdentifier user);
    }
}

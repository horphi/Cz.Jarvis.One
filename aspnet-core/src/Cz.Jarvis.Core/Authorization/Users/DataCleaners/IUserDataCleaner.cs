using Abp;
using System.Threading.Tasks;

namespace Cz.Jarvis.Authorization.Users.DataCleaners
{
    public interface IUserDataCleaner
    {
        Task CleanUserData(UserIdentifier userIdentifier);
    }
}

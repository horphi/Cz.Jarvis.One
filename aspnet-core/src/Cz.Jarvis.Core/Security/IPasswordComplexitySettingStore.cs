using System.Threading.Tasks;

namespace Cz.Jarvis.Security
{
    public interface IPasswordComplexitySettingStore
    {
        Task<PasswordComplexitySetting> GetSettingsAsync();
    }
}

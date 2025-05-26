using System.Globalization;

namespace Cz.Jarvis.Localization
{
    public interface IApplicationCulturesProvider
    {
        CultureInfo[] GetAllCultures();
    }
}
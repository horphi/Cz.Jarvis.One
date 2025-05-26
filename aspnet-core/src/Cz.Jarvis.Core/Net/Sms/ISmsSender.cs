using System.Threading.Tasks;

namespace Cz.Jarvis.Net.Sms
{
    public interface ISmsSender
    {
        Task SendAsync(string number, string message);
    }
}
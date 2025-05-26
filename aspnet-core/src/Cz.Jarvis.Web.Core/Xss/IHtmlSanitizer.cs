using Abp.Dependency;

namespace Cz.Jarvis.Web.Xss
{
    public interface IHtmlSanitizer: ITransientDependency
    {
        string Sanitize(string html);
    }
}
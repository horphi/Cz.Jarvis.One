using Abp.AspNetCore.Mvc.Views;

namespace Cz.Jarvis.Web.Views
{
    public abstract class JarvisRazorPage<TModel> : AbpRazorPage<TModel>
    {
        protected JarvisRazorPage()
        {
            LocalizationSourceName = JarvisConsts.LocalizationSourceName;
        }
    }
}

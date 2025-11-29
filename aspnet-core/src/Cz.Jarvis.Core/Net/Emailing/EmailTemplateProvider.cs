using Abp.Dependency;
using Abp.Extensions;
using Abp.IO.Extensions;
using Abp.MultiTenancy;
using Abp.Reflection.Extensions;
using Cz.Jarvis.Url;
using System;
using System.Collections.Concurrent;
using System.Text;

namespace Cz.Jarvis.Net.Emailing
{
    public class EmailTemplateProvider : IEmailTemplateProvider, ISingletonDependency
    {
        private readonly IWebUrlService _webUrlService;
        private readonly ConcurrentDictionary<string, string> _defaultTemplates;

        public EmailTemplateProvider(IWebUrlService webUrlService)
        {
            _webUrlService = webUrlService;
            _defaultTemplates = new ConcurrentDictionary<string, string>();
        }

        public string GetDefaultTemplate(int? tenantId)
        {
            var tenancyKey = tenantId.HasValue ? tenantId.Value.ToString() : "host";

            return _defaultTemplates.GetOrAdd(tenancyKey, key =>
            {
                using (var stream = typeof(EmailTemplateProvider).GetAssembly().GetManifestResourceStream("Cz.Jarvis.Net.Emailing.EmailTemplates.default.html"))
                {
                    var bytes = stream.GetAllBytes();
                    var template = Encoding.UTF8.GetString(bytes, 3, bytes.Length - 3);
                    template = template.Replace("{THIS_YEAR}", DateTime.Now.Year.ToString());
                    template = template.Replace("{TWITTER_URL}", GetTwitterIconUrl());
                    return template.Replace("{EMAIL_LOGO_URL}", GetTenantLogoUrl(tenantId));
                }
            });
        }

        private string GetTenantLogoUrl(int? tenantId)
        {
            // Multi-tenancy removed - always return single logo URL
            return _webUrlService.GetServerRootAddress().EnsureEndsWith('/') + "TenantCustomization/GetTenantLogo/light?tenantId=&extension=png";
        }

        private string GetTwitterIconUrl()
        {
           return _webUrlService.GetServerRootAddress().EnsureEndsWith('/') + "Common/Images/twitter.png";
        }
    }
}

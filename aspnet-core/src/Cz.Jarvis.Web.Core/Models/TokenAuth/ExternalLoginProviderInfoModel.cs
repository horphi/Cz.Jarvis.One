using System.Collections.Generic;
using Cz.AspNetJarvisCore.Web.Authentication.External;
using Abp.AutoMapper;

namespace Cz.Jarvis.Web.Models.TokenAuth
{
    [AutoMapFrom(typeof(ExternalLoginProviderInfo))]
    public class ExternalLoginProviderInfoModel
    {
        public string Name { get; set; }

        public string ClientId { get; set; }

        public Dictionary<string, string> AdditionalParams { get; set; }

    }
}

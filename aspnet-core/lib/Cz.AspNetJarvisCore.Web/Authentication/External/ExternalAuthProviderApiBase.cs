using System.Threading.Tasks;
using Abp.Dependency;

namespace Cz.AspNetJarvisCore.Web.Authentication.External
{
	public abstract class ExternalAuthProviderApiBase : IExternalAuthProviderApi, ITransientDependency
	{
		public ExternalLoginProviderInfo ProviderInfo { get; set; }

		public void Initialize(ExternalLoginProviderInfo providerInfo)
		{
			ProviderInfo = providerInfo;
		}

		public async Task<bool> IsValidUser(string userId, string accessCode)
		{
			return (await GetUserInfo(accessCode)).ProviderKey == userId;
		}

		public abstract Task<ExternalAuthUserInfo> GetUserInfo(string accessCode);
	}
}

using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;

namespace Cz.AspNetJarvisCore.Web.Authentication.External
{
	public class ExternalAuthManager : IExternalAuthManager, ITransientDependency
	{
		private readonly IIocResolver _iocResolver;

		private readonly IExternalAuthConfiguration _externalAuthConfiguration;

		public ExternalAuthManager(IIocResolver iocResolver, IExternalAuthConfiguration externalAuthConfiguration)
		{
			_iocResolver = iocResolver;
			_externalAuthConfiguration = externalAuthConfiguration;
		}

		public Task<bool> IsValidUser(string provider, string providerKey, string providerAccessCode)
		{
			IDisposableDependencyObjectWrapper<IExternalAuthProviderApi> val = CreateProviderApi(provider);
			try
			{
				return val.Object.IsValidUser(providerKey, providerAccessCode);
				//return val.get_Object().IsValidUser(providerKey, providerAccessCode);
			}
			finally
			{
				//((IDisposable)val)?.Dispose();
				val.Dispose();

			}
		}

		public Task<ExternalAuthUserInfo> GetUserInfo(string provider, string accessCode)
		{
			IDisposableDependencyObjectWrapper<IExternalAuthProviderApi> val = CreateProviderApi(provider);
			try
			{
				//return val.get_Object().GetUserInfo(accessCode);
				return val.Object.GetUserInfo(accessCode);
			}
			finally
			{
				//((IDisposable)val)?.Dispose(); 
				val.Dispose();
			}
		}

		public IDisposableDependencyObjectWrapper<IExternalAuthProviderApi> CreateProviderApi(string provider)
		{
			ExternalLoginProviderInfo externalLoginProviderInfo = ((!_externalAuthConfiguration.ExternalLoginInfoProviders.Any((IExternalLoginInfoProvider infoProvider) => infoProvider.Name == provider)) ? _externalAuthConfiguration.Providers.FirstOrDefault((ExternalLoginProviderInfo p) => p.Name == provider) : _externalAuthConfiguration.ExternalLoginInfoProviders.Single((IExternalLoginInfoProvider infoProvider) => infoProvider.Name == provider).GetExternalLoginInfo());
			
			if (externalLoginProviderInfo == null)
			{
				throw new Exception("Unknown external auth provider: " + provider);
			}
			IDisposableDependencyObjectWrapper<IExternalAuthProviderApi> val = IocResolverExtensions.ResolveAsDisposable<IExternalAuthProviderApi>(_iocResolver, externalLoginProviderInfo.ProviderApiType);
			val.Object.Initialize(externalLoginProviderInfo);
			return val;
		}
	}
}

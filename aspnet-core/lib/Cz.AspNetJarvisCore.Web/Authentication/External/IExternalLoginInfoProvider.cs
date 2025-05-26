namespace Cz.AspNetJarvisCore.Web.Authentication.External
{
	public interface IExternalLoginInfoProvider
	{
		string Name { get; }

		ExternalLoginProviderInfo GetExternalLoginInfo();
	}
}

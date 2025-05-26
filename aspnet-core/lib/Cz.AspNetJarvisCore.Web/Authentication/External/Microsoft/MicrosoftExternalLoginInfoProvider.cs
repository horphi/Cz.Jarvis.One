namespace Cz.AspNetJarvisCore.Web.Authentication.External.Microsoft
{
	public class MicrosoftExternalLoginInfoProvider : IExternalLoginInfoProvider
	{
		public string Name { get; } = "Microsoft";


		protected string ConsumerKey { get; set; }

		protected string ConsumerSecret { get; set; }

		protected ExternalLoginProviderInfo ExternalLoginProviderInfo { get; set; }

		public MicrosoftExternalLoginInfoProvider(string consumerKey, string consumerSecret)
		{
			ConsumerKey = consumerKey;
			ConsumerSecret = consumerSecret;
			CreateExternalLoginInfo();
		}

		private void CreateExternalLoginInfo()
		{
			ExternalLoginProviderInfo = new ExternalLoginProviderInfo("Microsoft", ConsumerKey, ConsumerSecret, typeof(MicrosoftAuthProviderApi));
		}

		public virtual ExternalLoginProviderInfo GetExternalLoginInfo()
		{
			return ExternalLoginProviderInfo;
		}
	}
}

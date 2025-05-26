using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace Cz.AspNetJarvisCore.Web.Authentication.External.Google
{
	public class GoogleAuthProviderApi : ExternalAuthProviderApiBase
	{
		public const string Name = "Google";

		public override async Task<ExternalAuthUserInfo> GetUserInfo(string accessCode)
		{
			string text = base.ProviderInfo.AdditionalParams["UserInfoEndpoint"];
			if (string.IsNullOrEmpty(text))
			{
				throw new ApplicationException("Authentication:Google:UserInfoEndpoint configuration is required.");
			}
			using HttpClient client = new HttpClient();
			client.DefaultRequestHeaders.UserAgent.ParseAdd("Microsoft ASP.NET Core OAuth middleware");
			client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
			client.Timeout = TimeSpan.FromSeconds(30.0);
			client.MaxResponseContentBufferSize = 10485760L;
			HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, text);
			httpRequestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessCode);
			HttpResponseMessage httpResponseMessage = await client.SendAsync(httpRequestMessage);
			httpResponseMessage.EnsureSuccessStatusCode();
			JObject user = JObject.Parse(await httpResponseMessage.Content.ReadAsStringAsync());
			return new ExternalAuthUserInfo
			{
				Name = GoogleHelper.GetName(user),
				EmailAddress = GoogleHelper.GetEmail(user),
				Surname = GoogleHelper.GetFamilyName(user),
				ProviderKey = GoogleHelper.GetId(user),
				Provider = "Google"
			};
		}
	}
}

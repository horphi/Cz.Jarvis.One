using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Newtonsoft.Json.Linq;

namespace Cz.AspNetJarvisCore.Web.Authentication.External.Microsoft
{
	public class MicrosoftAuthProviderApi : ExternalAuthProviderApiBase
	{
		public const string Name = "Microsoft";

		public override async Task<ExternalAuthUserInfo> GetUserInfo(string accessCode)
		{
			using HttpClient client = new HttpClient();
			client.DefaultRequestHeaders.UserAgent.ParseAdd("Microsoft ASP.NET Core OAuth middleware");
			client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
			client.Timeout = TimeSpan.FromSeconds(30.0);
			client.MaxResponseContentBufferSize = 10485760L;
			HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, MicrosoftAccountDefaults.UserInformationEndpoint);
			httpRequestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessCode);
			HttpResponseMessage httpResponseMessage = await client.SendAsync(httpRequestMessage);
			httpResponseMessage.EnsureSuccessStatusCode();
			JObject user = JObject.Parse(await httpResponseMessage.Content.ReadAsStringAsync());
			return new ExternalAuthUserInfo
			{
				Name = MicrosoftAccountHelper.GetDisplayName(user),
				EmailAddress = MicrosoftAccountHelper.GetEmail(user),
				Surname = MicrosoftAccountHelper.GetSurname(user),
				Provider = "Microsoft",
				ProviderKey = MicrosoftAccountHelper.GetId(user)
			};
		}
	}
}

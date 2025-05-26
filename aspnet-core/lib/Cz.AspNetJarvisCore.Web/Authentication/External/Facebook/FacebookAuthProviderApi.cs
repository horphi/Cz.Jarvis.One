using System;
using System.Globalization;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Abp.Extensions;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json.Linq;

namespace Cz.AspNetJarvisCore.Web.Authentication.External.Facebook
{
	public class FacebookAuthProviderApi : ExternalAuthProviderApiBase
	{
		public const string Name = "Facebook";

		public override async Task<ExternalAuthUserInfo> GetUserInfo(string accessCode)
		{
			string uri = QueryHelpers.AddQueryString("https://graph.facebook.com/v2.8/me", "access_token", accessCode);
			uri = QueryHelpers.AddQueryString(uri, "appsecret_proof", GenerateAppSecretProof(accessCode));
			uri = QueryHelpers.AddQueryString(uri, "fields", "email,last_name,first_name,middle_name");
			using HttpClient client = new HttpClient();
			client.DefaultRequestHeaders.UserAgent.ParseAdd("Microsoft ASP.NET Core OAuth middleware");
			client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
			client.DefaultRequestHeaders.Host = "graph.facebook.com";
			client.Timeout = TimeSpan.FromSeconds(30.0);
			client.MaxResponseContentBufferSize = 10485760L;
			HttpResponseMessage httpResponseMessage = await client.GetAsync(uri);
			httpResponseMessage.EnsureSuccessStatusCode();
			JObject user = JObject.Parse(await httpResponseMessage.Content.ReadAsStringAsync());
			string text = FacebookHelper.GetFirstName(user);
			string middleName = FacebookHelper.GetMiddleName(user);
			if (!StringExtensions.IsNullOrEmpty(middleName))
			{
				text += middleName;
			}
			return new ExternalAuthUserInfo
			{
				Name = text,
				EmailAddress = FacebookHelper.GetEmail(user),
				Surname = FacebookHelper.GetLastName(user),
				Provider = "Facebook",
				ProviderKey = FacebookHelper.GetId(user)
			};
		}

		private string GenerateAppSecretProof(string accessToken)
		{
			using HMACSHA256 hMACSHA = new HMACSHA256(Encoding.ASCII.GetBytes(base.ProviderInfo.ClientSecret));
			byte[] array = hMACSHA.ComputeHash(Encoding.ASCII.GetBytes(accessToken));
			StringBuilder stringBuilder = new StringBuilder();
			for (int i = 0; i < array.Length; i++)
			{
				stringBuilder.Append(array[i].ToString("x2", CultureInfo.InvariantCulture));
			}
			return stringBuilder.ToString();
		}
	}
}

using System;
using Newtonsoft.Json.Linq;

namespace Cz.AspNetJarvisCore.Web.Authentication.External.Microsoft
{
	public static class MicrosoftAccountHelper
	{
		public static string GetId(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"id");
		}

		public static string GetDisplayName(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"displayName");
		}

		public static string GetGivenName(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"givenName");
		}

		public static string GetSurname(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"surname");
		}

		public static string GetEmail(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"mail") ?? ((JToken)user).Value<string>((object)"userPrincipalName");
		}
	}
}

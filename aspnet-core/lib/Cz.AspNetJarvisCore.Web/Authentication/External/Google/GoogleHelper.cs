using System;
using Newtonsoft.Json.Linq;

namespace Cz.AspNetJarvisCore.Web.Authentication.External.Google
{
	public static class GoogleHelper
	{
		public static string GetId(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"id");
		}

		public static string GetName(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"name");
		}

		public static string GetGivenName(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"given_name");
		}

		public static string GetFamilyName(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"family_name");
		}

		public static string GetProfile(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"link");
		}

		public static string GetEmail(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException("" +
					"user");
			}
			return ((JToken)user).Value<string>((object)"email");
		}

		private static string TryGetValue(JObject user, string propertyName, string subProperty)
		{
			JToken val = default(JToken);
			if (user.TryGetValue(propertyName, out val))
			{
				JObject val2 = JObject.Parse(((object)val).ToString());
				if (val2 != null && val2.TryGetValue(subProperty, out val))
				{
					return ((object)val).ToString();
				}
			}
			return null;
		}

		private static string TryGetFirstValue(JObject user, string propertyName, string subProperty)
		{
			JToken val = default(JToken);
			if (user.TryGetValue(propertyName, out val))
			{
				JArray val2 = JArray.Parse(((object)val).ToString());
				if (val2 != null && ((JContainer)val2).Count > 0)
				{
					JObject val3 = JObject.Parse(((object)((JToken)val2).First).ToString());
					if (val3 != null && val3.TryGetValue(subProperty, out val))
					{
						return ((object)val).ToString();
					}
				}
			}
			return null;
		}
	}
}

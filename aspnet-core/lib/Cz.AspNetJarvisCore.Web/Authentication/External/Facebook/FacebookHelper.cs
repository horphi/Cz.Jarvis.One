using System;
using Newtonsoft.Json.Linq;

namespace Cz.AspNetJarvisCore.Web.Authentication.External.Facebook
{
	public static class FacebookHelper
	{
		public static string GetId(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"id");
		}

		public static string GetAgeRangeMin(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return TryGetValue(user, "age_range", "min");
		}

		public static string GetAgeRangeMax(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return TryGetValue(user, "age_range", "max");
		}

		public static string GetBirthday(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"birthday");
		}

		public static string GetEmail(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"email");
		}

		public static string GetFirstName(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"first_name");
		}

		public static string GetGender(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"gender");
		}

		public static string GetLastName(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"last_name");
		}

		public static string GetLink(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"link");
		}

		public static string GetLocation(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return TryGetValue(user, "location", "name");
		}

		public static string GetLocale(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"locale");
		}

		public static string GetMiddleName(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"middle_name");
		}

		public static string GetName(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"name");
		}

		public static string GetTimeZone(JObject user)
		{
			if (user == null)
			{
				throw new ArgumentNullException(nameof(user));
			}
			return ((JToken)user).Value<string>((object)"timezone");
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
	}
}

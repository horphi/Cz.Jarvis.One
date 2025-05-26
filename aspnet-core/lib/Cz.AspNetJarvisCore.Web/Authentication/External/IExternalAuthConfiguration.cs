using System;
using System.Collections.Generic;

namespace Cz.AspNetJarvisCore.Web.Authentication.External
{
	public interface IExternalAuthConfiguration
	{
		[Obsolete("Use IExternalLoginInfoProviders")]
		List<ExternalLoginProviderInfo> Providers { get; }

		List<IExternalLoginInfoProvider> ExternalLoginInfoProviders { get; }
	}
}

namespace Cz.Jarvis
{
    public class JarvisConsts
    {
        public const string LocalizationSourceName = "Jarvis";
        
        public const string ProductName = "Jarvis";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = false;
        
        /// <summary>
        /// Redirects users to host URL when using subdomain as tenancy name for not existing tenants
        /// </summary>
        public const bool PreventNotExistingTenantSubdomains = false;

        public const bool AllowTenantsToChangeEmailSettings = false;

        public const string Currency = "USD";

        public const string CurrencySign = "$";

        public const string AbpApiClientUserAgent = "AbpApiClient";

        public const string DateTimeOffsetFormat = "yyyy-MM-ddTHH:mm:sszzz";
    }
}

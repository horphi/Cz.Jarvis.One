using System;
using System.Security.Claims;
using Abp.Runtime.Security;

namespace Abp.Authorization;

internal static class AbpZeroClaimsIdentityHelper
{
    public static int? GetTenantId(ClaimsPrincipal principal)
    {
        var tenantIdOrNull = principal?.FindFirstValue("http://www.aspnetboilerplate.com/identity/claims/tenantId");
        if (tenantIdOrNull == null)
        {
            return null;
        }

        return Convert.ToInt32(tenantIdOrNull);
    }
}
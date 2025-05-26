using System.Collections.Generic;
using System.Security.Claims;
using Cz.AspNetJarvisCore.Web.Authentication.External;
using Abp.Dependency;
using Microsoft.AspNetCore.Identity;

namespace Cz.Jarvis.Web.Authentication.External
{
    public interface IExternalLoginInfoManager : ITransientDependency
    {
        string GetUserNameFromClaims(List<Claim> claims);

        string GetUserNameFromExternalAuthUserInfo(ExternalAuthUserInfo userInfo);

        (string name, string surname) GetNameAndSurnameFromClaims(List<Claim> claims, IdentityOptions identityOptions);
    }
}

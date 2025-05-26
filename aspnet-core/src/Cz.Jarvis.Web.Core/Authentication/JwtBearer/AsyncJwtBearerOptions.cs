using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Cz.Jarvis.Web.Authentication.JwtBearer
{
    public class AsyncJwtBearerOptions : JwtBearerOptions
    {
        public readonly List<IAsyncSecurityTokenValidator> AsyncSecurityTokenValidators;
        
        private readonly JarvisAsyncJwtSecurityTokenHandler _defaultAsyncHandler = new JarvisAsyncJwtSecurityTokenHandler();

        public AsyncJwtBearerOptions()
        {
            AsyncSecurityTokenValidators = new List<IAsyncSecurityTokenValidator>() {_defaultAsyncHandler};
        }
    }

}

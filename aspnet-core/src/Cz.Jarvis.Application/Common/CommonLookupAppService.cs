using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Microsoft.EntityFrameworkCore;
using Cz.Jarvis.Authorization;
using Cz.Jarvis.Common.Dto;


namespace Cz.Jarvis.Common
{
    [AbpAuthorize]
    public class CommonLookupAppService : JarvisAppServiceBase, ICommonLookupAppService
    {
        public CommonLookupAppService()
        {
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Users)]
        public async Task<PagedResultDto<FindUsersOutputDto>> FindUsers(FindUsersInput input)
        {
            var query = UserManager.Users
                .WhereIf(
                    !input.Filter.IsNullOrWhiteSpace(),
                    u =>
                        u.Name.Contains(input.Filter) ||
                        u.Surname.Contains(input.Filter) ||
                        u.UserName.Contains(input.Filter) ||
                        u.EmailAddress.Contains(input.Filter)
                ).WhereIf(input.ExcludeCurrentUser, u => u.Id != AbpSession.GetUserId());

            var userCount = await query.CountAsync();
            var users = await query
                .OrderBy(u => u.Name)
                .ThenBy(u => u.Surname)
                .PageBy(input)
                .ToListAsync();

            return new PagedResultDto<FindUsersOutputDto>(userCount,
                ObjectMapper.Map<List<FindUsersOutputDto>>(users));
        }
    }
}
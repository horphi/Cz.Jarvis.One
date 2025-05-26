using System;
using Abp;
using Abp.MultiTenancy;
using Cz.Jarvis.Authorization.Users;
using Cz.Jarvis.Authorization.Users.Dto;
using System.Threading.Tasks;

namespace Cz.Jarvis.Tests.Authorization.PasswordlessLogin
{
    public class PasswordlessLognTestBase : AppTestBase
    {
        protected int DefaultTenantId;
        protected string ProviderKeyEmail;
        protected string ProviderKeyPhoneNumber;
        protected string MockCode;

        private readonly IUserAppService _userAppService;

        public PasswordlessLognTestBase()
        {
            _userAppService = Resolve<IUserAppService>();
        }

        protected async Task CreateAndSetUser()
        {
            DefaultTenantId = (await GetTenantAsync(AbpTenantBase.DefaultTenantName)).Id;
            ProviderKeyEmail = "admin@czjarvis.com";
            ProviderKeyPhoneNumber = "05554443322";

            await CreateUser();
        }

        private async Task CreateUser()
        {
            await _userAppService.CreateOrUpdateUser(new CreateOrUpdateUserInput
            {
                User = new UserEditDto
                {
                    EmailAddress = ProviderKeyEmail,
                    Name = "admin",
                    Surname = "czjarvis",
                    UserName = "adminczjarvis",
                    Password = "123qwe",
                    PhoneNumber = ProviderKeyPhoneNumber
                },
                AssignedRoleNames = Array.Empty<string>()
            });
        }

        protected void SetMockCode()
        {
            MockCode = RandomHelper.GetRandom(100000, 999999).ToString();
        }

        protected string GetPasswordlessLoginCodeCacheKey(int? tenantId, string providerKey)
        {
            if (tenantId.HasValue)
            {
                return tenantId.Value + "|" + providerKey;
            }

            return providerKey;
        }
    }
}

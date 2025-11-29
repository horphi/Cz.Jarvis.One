using System.Threading.Tasks;
using Abp.MultiTenancy;

namespace Abp.Authorization.Users
{
    /// <summary>
    /// This is a helper base class to easily update <see cref="IExternalAuthenticationSource{TUser}"/>.
    /// Implements some methods as default but you can override all methods.
    /// </summary>
    /// <typeparam name="TUser">User type</typeparam>
    public abstract class DefaultExternalAuthenticationSource<TUser> : IExternalAuthenticationSource<TUser>
        where TUser : AbpUserBase, new()
    {
        /// <inheritdoc/>
        public abstract string Name { get; }

        /// <inheritdoc/>
        public abstract Task<bool> TryAuthenticateAsync(string userNameOrEmailAddress, string plainPassword);

        /// <inheritdoc/>
        public virtual Task<TUser> CreateUserAsync(string userNameOrEmailAddress)
        {
            return Task.FromResult(
                new TUser
                {
                    UserName = userNameOrEmailAddress,
                    Name = userNameOrEmailAddress,
                    Surname = userNameOrEmailAddress,
                    EmailAddress = userNameOrEmailAddress,
                    IsEmailConfirmed = true,
                    IsActive = true
                });
        }

        /// <inheritdoc/>
        public virtual Task UpdateUserAsync(TUser user)
        {
            return Task.FromResult(0);
        }
    }
}
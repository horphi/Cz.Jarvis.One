using Abp.Domain.Uow;
using Abp.EntityFrameworkCore;
using Abp.OpenIddict.EntityFrameworkCore.Tokens;
using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.OpenIddict.Tokens
{
    public class OpenIddictTokenRepository : EfCoreOpenIddictTokenRepository<JarvisDbContext>
    {
        public OpenIddictTokenRepository(
            IDbContextProvider<JarvisDbContext> dbContextProvider,
            IUnitOfWorkManager unitOfWorkManager) : base(dbContextProvider, unitOfWorkManager)
        {
        }
    }
}
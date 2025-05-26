using Abp.Domain.Uow;
using Abp.EntityFrameworkCore;
using Abp.OpenIddict.EntityFrameworkCore.Scopes;
using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.OpenIddict.Scopes
{
    public class OpenIddictScopeRepository : EfCoreOpenIddictScopeRepository<JarvisDbContext>
    {
        public OpenIddictScopeRepository(
            IDbContextProvider<JarvisDbContext> dbContextProvider,
            IUnitOfWorkManager unitOfWorkManager) : base(dbContextProvider, unitOfWorkManager)
        {
        }
    }
}
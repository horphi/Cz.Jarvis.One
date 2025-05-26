using Abp.Domain.Uow;
using Abp.EntityFrameworkCore;
using Abp.OpenIddict.EntityFrameworkCore.Authorizations;
using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.OpenIddict.Authorizations
{
    public class OpenIddictAuthorizationRepository : EfCoreOpenIddictAuthorizationRepository<JarvisDbContext>
    {
        public OpenIddictAuthorizationRepository(
            IDbContextProvider<JarvisDbContext> dbContextProvider,
            IUnitOfWorkManager unitOfWorkManager) : base(dbContextProvider, unitOfWorkManager)
        {
        }
    }
}
using Abp.Domain.Uow;
using Abp.EntityFrameworkCore;
using Abp.OpenIddict.EntityFrameworkCore.Applications;
using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.OpenIddict.Applications
{
    public class OpenIddictApplicationRepository : EfCoreOpenIddictApplicationRepository<JarvisDbContext>
    {
        public OpenIddictApplicationRepository(
            IDbContextProvider<JarvisDbContext> dbContextProvider,
            IUnitOfWorkManager unitOfWorkManager) : base(dbContextProvider, unitOfWorkManager)
        {
        }
    }
}
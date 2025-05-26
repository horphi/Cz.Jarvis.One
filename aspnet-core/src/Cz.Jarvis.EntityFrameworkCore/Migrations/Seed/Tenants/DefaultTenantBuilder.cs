using System.Linq;
using Abp.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.Migrations.Seed.Tenants
{
    public class DefaultTenantBuilder
    {
        private readonly JarvisDbContext _context;

        public DefaultTenantBuilder(JarvisDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateDefaultTenant();
        }

        private void CreateDefaultTenant()
        {
            //Default tenant

            var defaultTenant = _context.Tenants.IgnoreQueryFilters().FirstOrDefault(t => t.TenancyName == MultiTenancy.Tenant.DefaultTenantName);
            if (defaultTenant == null)
            {
                defaultTenant = new MultiTenancy.Tenant(AbpTenantBase.DefaultTenantName, AbpTenantBase.DefaultTenantName);
                
                _context.Tenants.Add(defaultTenant);
                _context.SaveChanges();
            }
        }
    }
}

using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Authorization.Users;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Abp.Runtime.Caching;
using Abp.UI;
using Abp.Zero;

namespace Abp.MultiTenancy
{
    /// <summary>
    /// Tenant manager.
    /// Implements domain logic for <see cref="AbpTenant{TUser}"/>.
    /// </summary>
    /// <typeparam name="TTenant">Type of the application Tenant</typeparam>
    /// <typeparam name="TUser">Type of the application User</typeparam>
    public class AbpTenantManager<TTenant, TUser> : IDomainService,
        IEventHandler<EntityChangedEventData<TTenant>>
        where TTenant : AbpTenant<TUser>
        where TUser : AbpUserBase
    {

        public ILocalizationManager LocalizationManager { get; set; }

        protected string LocalizationSourceName { get; set; }

        public ICacheManager CacheManager { get; set; }
        
        public IUnitOfWorkManager UnitOfWorkManager { get; set; }

        protected IRepository<TTenant> TenantRepository { get; set; }
        public AbpTenantManager(
            IRepository<TTenant> tenantRepository)
        {
            TenantRepository = tenantRepository;
            LocalizationManager = NullLocalizationManager.Instance;
            LocalizationSourceName = AbpZeroConsts.LocalizationSourceName;
        }

        public virtual IQueryable<TTenant> Tenants { get { return TenantRepository.GetAll(); } }

        public virtual async Task CreateAsync(TTenant tenant)
        {
            await UnitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                await ValidateTenantAsync(tenant);

                if (await TenantRepository.FirstOrDefaultAsync(t => t.TenancyName == tenant.TenancyName) != null)
                {
                    throw new UserFriendlyException(string.Format(L("TenancyNameIsAlreadyTaken"), tenant.TenancyName));
                }

                await TenantRepository.InsertAsync(tenant);
            });
        }

        public virtual void Create(TTenant tenant)
        {
            UnitOfWorkManager.WithUnitOfWork(() =>
            {
                ValidateTenant(tenant);

                if (TenantRepository.FirstOrDefault(t => t.TenancyName == tenant.TenancyName) != null)
                {
                    throw new UserFriendlyException(string.Format(L("TenancyNameIsAlreadyTaken"), tenant.TenancyName));
                }

                TenantRepository.Insert(tenant);
            });
        }

        public virtual async Task UpdateAsync(TTenant tenant)
        {
            await UnitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                if (await TenantRepository.FirstOrDefaultAsync(t => t.TenancyName == tenant.TenancyName && t.Id != tenant.Id) != null)
                {
                    throw new UserFriendlyException(string.Format(L("TenancyNameIsAlreadyTaken"), tenant.TenancyName));
                }

                await TenantRepository.UpdateAsync(tenant);
            });
        }

        public virtual void Update(TTenant tenant)
        {
            UnitOfWorkManager.WithUnitOfWork(() =>
            {
                if (TenantRepository.FirstOrDefault(t => t.TenancyName == tenant.TenancyName && t.Id != tenant.Id) != null)
                {
                    throw new UserFriendlyException(string.Format(L("TenancyNameIsAlreadyTaken"), tenant.TenancyName));
                }

                TenantRepository.Update(tenant);
            });
        }

        public virtual async Task<TTenant> FindByIdAsync(int id)
        {
            return await UnitOfWorkManager.WithUnitOfWorkAsync(async () => await TenantRepository.FirstOrDefaultAsync(id));
        }

        public virtual TTenant FindById(int id)
        {
            return UnitOfWorkManager.WithUnitOfWork(() => TenantRepository.FirstOrDefault(id));
        }

        public virtual async Task<TTenant> GetByIdAsync(int id)
        {
            var tenant = await FindByIdAsync(id);
            if (tenant == null)
            {
                throw new AbpException("There is no tenant with id: " + id);
            }

            return tenant;
        }

        public virtual TTenant GetById(int id)
        {
            var tenant = FindById(id);
            if (tenant == null)
            {
                throw new AbpException("There is no tenant with id: " + id);
            }

            return tenant;
        }

        public virtual async Task<TTenant> FindByTenancyNameAsync(string tenancyName)
        {
            return await UnitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                return await TenantRepository.FirstOrDefaultAsync(t => t.TenancyName == tenancyName);
            });
        }

        public virtual TTenant FindByTenancyName(string tenancyName)
        {
            return UnitOfWorkManager.WithUnitOfWork(() =>
            {
                return TenantRepository.FirstOrDefault(t => t.TenancyName == tenancyName);
            });
        }

        public virtual async Task DeleteAsync(TTenant tenant)
        {
            await UnitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                await TenantRepository.DeleteAsync(tenant);
            });
        }

        public virtual void Delete(TTenant tenant)
        {
            UnitOfWorkManager.WithUnitOfWork(() =>
            {
                TenantRepository.Delete(tenant);
            });
        }
        

        protected virtual async Task ValidateTenantAsync(TTenant tenant)
        {
            await ValidateTenancyNameAsync(tenant.TenancyName);
        }

        protected virtual void ValidateTenant(TTenant tenant)
        {
            ValidateTenancyName(tenant.TenancyName);
        }

        protected virtual Task ValidateTenancyNameAsync(string tenancyName)
        {
            if (!Regex.IsMatch(tenancyName, AbpTenant<TUser>.TenancyNameRegex))
            {
                throw new UserFriendlyException(L("InvalidTenancyName"));
            }

            return Task.FromResult(0);
        }

        protected virtual void ValidateTenancyName(string tenancyName)
        {
            if (!Regex.IsMatch(tenancyName, AbpTenant<TUser>.TenancyNameRegex))
            {
                throw new UserFriendlyException(L("InvalidTenancyName"));
            }
        }

        protected virtual string L(string name)
        {
            return LocalizationManager.GetString(LocalizationSourceName, name);
        }

        protected virtual string L(string name, CultureInfo cultureInfo)
        {
            return LocalizationManager.GetString(LocalizationSourceName, name, cultureInfo);
        }

        public void HandleEvent(EntityChangedEventData<TTenant> eventData)
        {
            if (eventData.Entity.IsTransient())
            {
                return;
            }

            //CacheManager.GetTenantFeatureCache().Remove(eventData.Entity.Id);
        }
        
      
    }
}

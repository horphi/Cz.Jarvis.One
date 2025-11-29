using System;
using System.Collections.Generic;
using System.Linq;
using Abp.BackgroundJobs;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Abp.Timing;

namespace Abp.Authorization.Users;

public class UserTokenExpirationWorker<TUser> : PeriodicBackgroundWorkerBase
    where TUser : AbpUserBase
{
    private readonly IRepository<UserToken, long> _userTokenRepository;
    private readonly IUnitOfWorkManager _unitOfWorkManager;

    public UserTokenExpirationWorker(
        AbpTimer timer,
        IRepository<UserToken, long> userTokenRepository,
        IBackgroundJobConfiguration backgroundJobConfiguration,
        IUnitOfWorkManager unitOfWorkManager)
        : base(timer)
    {
        _userTokenRepository = userTokenRepository;
        _unitOfWorkManager = unitOfWorkManager;

        Timer.Period = backgroundJobConfiguration.UserTokenExpirationPeriod?.TotalMilliseconds.To<int>()
#pragma warning disable CS0618 // Type or member is obsolete, this line will be removed once support for CleanUserTokenPeriod property is removed
                       ?? backgroundJobConfiguration.CleanUserTokenPeriod
#pragma warning restore CS0618 // Type or member is obsolete, this line will be removed once support for CleanUserTokenPeriod property is removed
                       ?? TimeSpan.FromHours(1).TotalMilliseconds.To<int>();
    }

    protected override void DoWork()
    {
        // Multi-tenancy removed - delete expired tokens without tenant iteration
        var utcNow = Clock.Now.ToUniversalTime();

        using (var uow = _unitOfWorkManager.Begin())
        {
            _userTokenRepository.Delete(t => t.ExpireDate <= utcNow);
            uow.Complete();
        }
    }
}
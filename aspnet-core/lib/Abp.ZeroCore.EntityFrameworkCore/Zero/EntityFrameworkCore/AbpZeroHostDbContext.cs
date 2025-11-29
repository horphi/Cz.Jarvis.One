using Abp.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.BackgroundJobs;
using Abp.MultiTenancy;
using Abp.Notifications;
using Microsoft.EntityFrameworkCore;

namespace Abp.Zero.EntityFrameworkCore;

[MultiTenancySide(MultiTenancySides.Host)]
public abstract class AbpZeroHostDbContext<TTenant, TRole, TUser, TSelf> : AbpZeroCommonDbContext<TRole, TUser, TSelf>
    where TTenant : AbpTenant<TUser>
    where TRole : AbpRole<TUser>
    where TUser : AbpUser<TUser>
    where TSelf : AbpZeroHostDbContext<TTenant, TRole, TUser, TSelf>
{
    /// <summary>
    /// Tenants
    /// </summary>
    public virtual DbSet<TTenant> Tenants { get; set; }
    

    /// <summary>
    /// Background jobs.
    /// </summary>
    public virtual DbSet<BackgroundJobInfo> BackgroundJobs { get; set; }

    /// <summary>
    /// User accounts
    /// </summary>
    public virtual DbSet<UserAccount> UserAccounts { get; set; }

    /// <summary>
    /// Notifications.
    /// </summary>
    public virtual DbSet<NotificationInfo> Notifications { get; set; }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="options"></param>
    protected AbpZeroHostDbContext(DbContextOptions<TSelf> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TTenant>(b =>
        {
            b.HasOne(p => p.DeleterUser)
                .WithMany()
                .HasForeignKey(p => p.DeleterUserId);

            b.HasOne(p => p.CreatorUser)
                .WithMany()
                .HasForeignKey(p => p.CreatorUserId);

            b.HasOne(p => p.LastModifierUser)
                .WithMany()
                .HasForeignKey(p => p.LastModifierUserId);

            b.HasIndex(e => e.TenancyName);
        });

        modelBuilder.Entity<BackgroundJobInfo>(b =>
        {
            b.HasIndex(e => new { e.IsAbandoned, e.NextTryTime });
        });
        

        modelBuilder.Entity<UserAccount>(b =>
        {
            b.HasIndex(e => e.UserId);
            b.HasIndex(e => e.UserName);
            b.HasIndex(e => e.EmailAddress);
        });
    }
}
using Abp.Auditing;
using Abp.Authorization;
using Abp.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.BackgroundJobs;
using Abp.Configuration;
using Abp.DynamicEntityProperties;
using Abp.EntityHistory;
using Abp.Localization;
using Abp.MultiTenancy;
using Abp.Notifications;
using Abp.Webhooks;
using Microsoft.EntityFrameworkCore;

namespace Abp.Zero.EntityFrameworkCore;

/// <summary>
/// Extension methods for <see cref="ModelBuilder"/>.
/// </summary>
public static class AbpZeroDbModelBuilderExtensions
{
    /// <summary>
    /// Changes prefix for ABP tables (which is "Abp" by default).
    /// Can be null/empty string to clear the prefix.
    /// </summary>
    /// <typeparam name="TTenant">The type of the tenant entity.</typeparam>
    /// <typeparam name="TRole">The type of the role entity.</typeparam>
    /// <typeparam name="TUser">The type of the user entity.</typeparam>
    /// <param name="modelBuilder">Model builder.</param>
    /// <param name="prefix">Table prefix, or null to clear prefix.</param>
    /// <param name="schemaName">Schema name</param>
    public static void ChangeAbpTablePrefix<TTenant, TRole, TUser>(this ModelBuilder modelBuilder, string prefix, string schemaName = null)
        where TTenant : AbpTenant<TUser>
        where TRole : AbpRole<TUser>
        where TUser : AbpUser<TUser>
    {
        prefix = prefix ?? "";

        SetTableName<AuditLog>(modelBuilder, prefix + "AuditLogs", schemaName);
        SetTableName<BackgroundJobInfo>(modelBuilder, prefix + "BackgroundJobs", schemaName);
        SetTableName<EntityChange>(modelBuilder, prefix + "EntityChanges", schemaName);
        SetTableName<EntityChangeSet>(modelBuilder, prefix + "EntityChangeSets", schemaName);
        SetTableName<EntityPropertyChange>(modelBuilder, prefix + "EntityPropertyChanges", schemaName);
        SetTableName<ApplicationLanguage>(modelBuilder, prefix + "Languages", schemaName);
        SetTableName<ApplicationLanguageText>(modelBuilder, prefix + "LanguageTexts", schemaName);
        SetTableName<NotificationInfo>(modelBuilder, prefix + "Notifications", schemaName);
        SetTableName<NotificationSubscriptionInfo>(modelBuilder, prefix + "NotificationSubscriptions", schemaName);
        SetTableName<PermissionSetting>(modelBuilder, prefix + "Permissions", schemaName);
        SetTableName<RolePermissionSetting>(modelBuilder, prefix + "Permissions", schemaName);
        SetTableName<UserPermissionSetting>(modelBuilder, prefix + "Permissions", schemaName);
        SetTableName<TRole>(modelBuilder, prefix + "Roles", schemaName);
        SetTableName<Setting>(modelBuilder, prefix + "Settings", schemaName);
        SetTableName<TTenant>(modelBuilder, prefix + "Tenants", schemaName);
        SetTableName<UserLogin>(modelBuilder, prefix + "UserLogins", schemaName);
        SetTableName<UserLoginAttempt>(modelBuilder, prefix + "UserLoginAttempts", schemaName);
        SetTableName<TenantNotificationInfo>(modelBuilder, prefix + "TenantNotifications", schemaName);
        SetTableName<UserNotificationInfo>(modelBuilder, prefix + "UserNotifications", schemaName);
        SetTableName<UserRole>(modelBuilder, prefix + "UserRoles", schemaName);
        SetTableName<TUser>(modelBuilder, prefix + "Users", schemaName);
        SetTableName<UserAccount>(modelBuilder, prefix + "UserAccounts", schemaName);
        SetTableName<UserClaim>(modelBuilder, prefix + "UserClaims", schemaName);
        SetTableName<RoleClaim>(modelBuilder, prefix + "RoleClaims", schemaName);
        SetTableName<UserToken>(modelBuilder, prefix + "UserTokens", schemaName);
        SetTableName<WebhookEvent>(modelBuilder, prefix + "WebhookEvents", schemaName);
        SetTableName<WebhookSubscriptionInfo>(modelBuilder, prefix + "WebhookSubscriptions", schemaName);
        SetTableName<WebhookSendAttempt>(modelBuilder, prefix + "WebhookSendAttempts", schemaName);
        SetTableName<DynamicProperty>(modelBuilder, prefix + "DynamicProperties", schemaName);
        SetTableName<DynamicPropertyValue>(modelBuilder, prefix + "DynamicPropertyValues", schemaName);
        SetTableName<DynamicEntityProperty>(modelBuilder, prefix + "DynamicEntityProperties", schemaName);
        SetTableName<DynamicEntityPropertyValue>(modelBuilder, prefix + "DynamicEntityPropertyValues", schemaName);
    }

    internal static void SetTableName<TEntity>(this ModelBuilder modelBuilder, string tableName, string schemaName)
        where TEntity : class
    {
        if (schemaName == null)
        {
            modelBuilder.Entity<TEntity>().ToTable(tableName);
        }
        else
        {
            modelBuilder.Entity<TEntity>().ToTable(tableName, schemaName);
        }
    }
}
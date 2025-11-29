using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cz.Jarvis.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMultiTenancy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AbpTenants");

            migrationBuilder.DropIndex(
                name: "IX_AppUserDelegations_TenantId_SourceUserId",
                table: "AppUserDelegations");

            migrationBuilder.DropIndex(
                name: "IX_AppUserDelegations_TenantId_TargetUserId",
                table: "AppUserDelegations");

            migrationBuilder.DropIndex(
                name: "IX_AppFriendships_FriendTenantId_FriendUserId",
                table: "AppFriendships");

            migrationBuilder.DropIndex(
                name: "IX_AppFriendships_FriendTenantId_UserId",
                table: "AppFriendships");

            migrationBuilder.DropIndex(
                name: "IX_AppFriendships_TenantId_FriendUserId",
                table: "AppFriendships");

            migrationBuilder.DropIndex(
                name: "IX_AppFriendships_TenantId_UserId",
                table: "AppFriendships");

            migrationBuilder.DropIndex(
                name: "IX_AppChatMessages_TargetTenantId_TargetUserId_ReadState",
                table: "AppChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_AppChatMessages_TargetTenantId_UserId_ReadState",
                table: "AppChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_AppChatMessages_TenantId_TargetUserId_ReadState",
                table: "AppChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_AppChatMessages_TenantId_UserId_ReadState",
                table: "AppChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_AppBinaryObjects_TenantId",
                table: "AppBinaryObjects");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserTokens_TenantId_UserId",
                table: "AbpUserTokens");

            migrationBuilder.DropIndex(
                name: "IX_AbpUsers_TenantId_NormalizedEmailAddress",
                table: "AbpUsers");

            migrationBuilder.DropIndex(
                name: "IX_AbpUsers_TenantId_NormalizedUserName",
                table: "AbpUsers");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserRoles_TenantId_RoleId",
                table: "AbpUserRoles");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserRoles_TenantId_UserId",
                table: "AbpUserRoles");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserLogins_ProviderKey_TenantId",
                table: "AbpUserLogins");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserLogins_TenantId_LoginProvider_ProviderKey",
                table: "AbpUserLogins");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserLogins_TenantId_UserId",
                table: "AbpUserLogins");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserLoginAttempts_TenancyName_UserNameOrEmailAddress_Resu~",
                table: "AbpUserLoginAttempts");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserLoginAttempts_UserId_TenantId",
                table: "AbpUserLoginAttempts");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserClaims_TenantId_ClaimType",
                table: "AbpUserClaims");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserAccounts_TenantId_EmailAddress",
                table: "AbpUserAccounts");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserAccounts_TenantId_UserId",
                table: "AbpUserAccounts");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserAccounts_TenantId_UserName",
                table: "AbpUserAccounts");

            migrationBuilder.DropIndex(
                name: "IX_AbpTenantNotifications_TenantId",
                table: "AbpTenantNotifications");

            migrationBuilder.DropIndex(
                name: "IX_AbpSettings_TenantId_Name_UserId",
                table: "AbpSettings");

            migrationBuilder.DropIndex(
                name: "IX_AbpRoles_TenantId_NormalizedName",
                table: "AbpRoles");

            migrationBuilder.DropIndex(
                name: "IX_AbpRoleClaims_TenantId_ClaimType",
                table: "AbpRoleClaims");

            migrationBuilder.DropIndex(
                name: "IX_AbpPermissions_TenantId_Name",
                table: "AbpPermissions");

            migrationBuilder.DropIndex(
                name: "IX_AbpNotificationSubscriptions_TenantId_NotificationName_Entit~",
                table: "AbpNotificationSubscriptions");

            migrationBuilder.DropIndex(
                name: "IX_AbpLanguageTexts_TenantId_Source_LanguageName_Key",
                table: "AbpLanguageTexts");

            migrationBuilder.DropIndex(
                name: "IX_AbpLanguages_TenantId_Name",
                table: "AbpLanguages");

            migrationBuilder.DropIndex(
                name: "IX_AbpEntityChangeSets_TenantId_CreationTime",
                table: "AbpEntityChangeSets");

            migrationBuilder.DropIndex(
                name: "IX_AbpEntityChangeSets_TenantId_Reason",
                table: "AbpEntityChangeSets");

            migrationBuilder.DropIndex(
                name: "IX_AbpEntityChangeSets_TenantId_UserId",
                table: "AbpEntityChangeSets");

            migrationBuilder.DropIndex(
                name: "IX_AbpDynamicProperties_PropertyName_TenantId",
                table: "AbpDynamicProperties");

            migrationBuilder.DropIndex(
                name: "IX_AbpDynamicEntityProperties_EntityFullName_DynamicPropertyId_~",
                table: "AbpDynamicEntityProperties");

            migrationBuilder.DropIndex(
                name: "IX_AbpAuditLogs_TenantId_ExecutionDuration",
                table: "AbpAuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AbpAuditLogs_TenantId_ExecutionTime",
                table: "AbpAuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AbpAuditLogs_TenantId_UserId",
                table: "AbpAuditLogs");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppUserDelegations");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppRecentPasswords");

            migrationBuilder.DropColumn(
                name: "FriendTenancyName",
                table: "AppFriendships");

            migrationBuilder.DropColumn(
                name: "FriendTenantId",
                table: "AppFriendships");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppFriendships");

            migrationBuilder.DropColumn(
                name: "TargetTenantId",
                table: "AppChatMessages");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppChatMessages");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppBinaryObjects");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AbpUserRoles");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AbpUserAccounts");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AbpRoles");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AbpPermissions");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserDelegations_SourceUserId",
                table: "AppUserDelegations",
                column: "SourceUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserDelegations_TargetUserId",
                table: "AppUserDelegations",
                column: "TargetUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFriendships_FriendUserId",
                table: "AppFriendships",
                column: "FriendUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFriendships_UserId",
                table: "AppFriendships",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppChatMessages_TargetUserId_ReadState",
                table: "AppChatMessages",
                columns: new[] { "TargetUserId", "ReadState" });

            migrationBuilder.CreateIndex(
                name: "IX_AppChatMessages_UserId_ReadState",
                table: "AppChatMessages",
                columns: new[] { "UserId", "ReadState" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_NormalizedEmailAddress",
                table: "AbpUsers",
                column: "NormalizedEmailAddress");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_NormalizedUserName",
                table: "AbpUsers",
                column: "NormalizedUserName");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserRoles_RoleId",
                table: "AbpUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLogins_LoginProvider_ProviderKey",
                table: "AbpUserLogins",
                columns: new[] { "LoginProvider", "ProviderKey" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLogins_ProviderKey",
                table: "AbpUserLogins",
                column: "ProviderKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLoginAttempts_UserId",
                table: "AbpUserLoginAttempts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLoginAttempts_UserNameOrEmailAddress_Result",
                table: "AbpUserLoginAttempts",
                columns: new[] { "UserNameOrEmailAddress", "Result" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserClaims_ClaimType",
                table: "AbpUserClaims",
                column: "ClaimType");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserAccounts_UserId",
                table: "AbpUserAccounts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpSettings_Name_UserId",
                table: "AbpSettings",
                columns: new[] { "Name", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoles_NormalizedName",
                table: "AbpRoles",
                column: "NormalizedName");

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoleClaims_ClaimType",
                table: "AbpRoleClaims",
                column: "ClaimType");

            migrationBuilder.CreateIndex(
                name: "IX_AbpPermissions_Name",
                table: "AbpPermissions",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_AbpLanguageTexts_Source_LanguageName_Key",
                table: "AbpLanguageTexts",
                columns: new[] { "Source", "LanguageName", "Key" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpLanguages_Name",
                table: "AbpLanguages",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChangeSets_CreationTime",
                table: "AbpEntityChangeSets",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChangeSets_Reason",
                table: "AbpEntityChangeSets",
                column: "Reason");

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChangeSets_UserId",
                table: "AbpEntityChangeSets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpDynamicProperties_PropertyName",
                table: "AbpDynamicProperties",
                column: "PropertyName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpDynamicEntityProperties_EntityFullName_DynamicPropertyId",
                table: "AbpDynamicEntityProperties",
                columns: new[] { "EntityFullName", "DynamicPropertyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpAuditLogs_ExecutionDuration",
                table: "AbpAuditLogs",
                column: "ExecutionDuration");

            migrationBuilder.CreateIndex(
                name: "IX_AbpAuditLogs_ExecutionTime",
                table: "AbpAuditLogs",
                column: "ExecutionTime");

            migrationBuilder.CreateIndex(
                name: "IX_AbpAuditLogs_UserId",
                table: "AbpAuditLogs",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppUserDelegations_SourceUserId",
                table: "AppUserDelegations");

            migrationBuilder.DropIndex(
                name: "IX_AppUserDelegations_TargetUserId",
                table: "AppUserDelegations");

            migrationBuilder.DropIndex(
                name: "IX_AppFriendships_FriendUserId",
                table: "AppFriendships");

            migrationBuilder.DropIndex(
                name: "IX_AppFriendships_UserId",
                table: "AppFriendships");

            migrationBuilder.DropIndex(
                name: "IX_AppChatMessages_TargetUserId_ReadState",
                table: "AppChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_AppChatMessages_UserId_ReadState",
                table: "AppChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_AbpUsers_NormalizedEmailAddress",
                table: "AbpUsers");

            migrationBuilder.DropIndex(
                name: "IX_AbpUsers_NormalizedUserName",
                table: "AbpUsers");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserRoles_RoleId",
                table: "AbpUserRoles");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserLogins_LoginProvider_ProviderKey",
                table: "AbpUserLogins");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserLogins_ProviderKey",
                table: "AbpUserLogins");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserLoginAttempts_UserId",
                table: "AbpUserLoginAttempts");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserLoginAttempts_UserNameOrEmailAddress_Result",
                table: "AbpUserLoginAttempts");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserClaims_ClaimType",
                table: "AbpUserClaims");

            migrationBuilder.DropIndex(
                name: "IX_AbpUserAccounts_UserId",
                table: "AbpUserAccounts");

            migrationBuilder.DropIndex(
                name: "IX_AbpSettings_Name_UserId",
                table: "AbpSettings");

            migrationBuilder.DropIndex(
                name: "IX_AbpRoles_NormalizedName",
                table: "AbpRoles");

            migrationBuilder.DropIndex(
                name: "IX_AbpRoleClaims_ClaimType",
                table: "AbpRoleClaims");

            migrationBuilder.DropIndex(
                name: "IX_AbpPermissions_Name",
                table: "AbpPermissions");

            migrationBuilder.DropIndex(
                name: "IX_AbpLanguageTexts_Source_LanguageName_Key",
                table: "AbpLanguageTexts");

            migrationBuilder.DropIndex(
                name: "IX_AbpLanguages_Name",
                table: "AbpLanguages");

            migrationBuilder.DropIndex(
                name: "IX_AbpEntityChangeSets_CreationTime",
                table: "AbpEntityChangeSets");

            migrationBuilder.DropIndex(
                name: "IX_AbpEntityChangeSets_Reason",
                table: "AbpEntityChangeSets");

            migrationBuilder.DropIndex(
                name: "IX_AbpEntityChangeSets_UserId",
                table: "AbpEntityChangeSets");

            migrationBuilder.DropIndex(
                name: "IX_AbpDynamicProperties_PropertyName",
                table: "AbpDynamicProperties");

            migrationBuilder.DropIndex(
                name: "IX_AbpDynamicEntityProperties_EntityFullName_DynamicPropertyId",
                table: "AbpDynamicEntityProperties");

            migrationBuilder.DropIndex(
                name: "IX_AbpAuditLogs_ExecutionDuration",
                table: "AbpAuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AbpAuditLogs_ExecutionTime",
                table: "AbpAuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AbpAuditLogs_UserId",
                table: "AbpAuditLogs");

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AppUserDelegations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AppRecentPasswords",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FriendTenancyName",
                table: "AppFriendships",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "FriendTenantId",
                table: "AppFriendships",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AppFriendships",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TargetTenantId",
                table: "AppChatMessages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AppChatMessages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AppBinaryObjects",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AbpUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AbpUserRoles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AbpUserAccounts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AbpRoles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AbpPermissions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AbpTenants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    ConnectionString = table.Column<string>(type: "varchar(1024)", maxLength: 1024, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreationTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CustomCssId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    DarkLogoFileType = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DarkLogoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    DarkLogoMinimalFileType = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DarkLogoMinimalId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    DeletionTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LightLogoFileType = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LightLogoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    LightLogoMinimalFileType = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LightLogoMinimalId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TenancyName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpTenants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpTenants_AbpUsers_CreatorUserId",
                        column: x => x.CreatorUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AbpTenants_AbpUsers_DeleterUserId",
                        column: x => x.DeleterUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AbpTenants_AbpUsers_LastModifierUserId",
                        column: x => x.LastModifierUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserDelegations_TenantId_SourceUserId",
                table: "AppUserDelegations",
                columns: new[] { "TenantId", "SourceUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserDelegations_TenantId_TargetUserId",
                table: "AppUserDelegations",
                columns: new[] { "TenantId", "TargetUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppFriendships_FriendTenantId_FriendUserId",
                table: "AppFriendships",
                columns: new[] { "FriendTenantId", "FriendUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppFriendships_FriendTenantId_UserId",
                table: "AppFriendships",
                columns: new[] { "FriendTenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppFriendships_TenantId_FriendUserId",
                table: "AppFriendships",
                columns: new[] { "TenantId", "FriendUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppFriendships_TenantId_UserId",
                table: "AppFriendships",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppChatMessages_TargetTenantId_TargetUserId_ReadState",
                table: "AppChatMessages",
                columns: new[] { "TargetTenantId", "TargetUserId", "ReadState" });

            migrationBuilder.CreateIndex(
                name: "IX_AppChatMessages_TargetTenantId_UserId_ReadState",
                table: "AppChatMessages",
                columns: new[] { "TargetTenantId", "UserId", "ReadState" });

            migrationBuilder.CreateIndex(
                name: "IX_AppChatMessages_TenantId_TargetUserId_ReadState",
                table: "AppChatMessages",
                columns: new[] { "TenantId", "TargetUserId", "ReadState" });

            migrationBuilder.CreateIndex(
                name: "IX_AppChatMessages_TenantId_UserId_ReadState",
                table: "AppChatMessages",
                columns: new[] { "TenantId", "UserId", "ReadState" });

            migrationBuilder.CreateIndex(
                name: "IX_AppBinaryObjects_TenantId",
                table: "AppBinaryObjects",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserTokens_TenantId_UserId",
                table: "AbpUserTokens",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_TenantId_NormalizedEmailAddress",
                table: "AbpUsers",
                columns: new[] { "TenantId", "NormalizedEmailAddress" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_TenantId_NormalizedUserName",
                table: "AbpUsers",
                columns: new[] { "TenantId", "NormalizedUserName" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserRoles_TenantId_RoleId",
                table: "AbpUserRoles",
                columns: new[] { "TenantId", "RoleId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserRoles_TenantId_UserId",
                table: "AbpUserRoles",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLogins_ProviderKey_TenantId",
                table: "AbpUserLogins",
                columns: new[] { "ProviderKey", "TenantId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLogins_TenantId_LoginProvider_ProviderKey",
                table: "AbpUserLogins",
                columns: new[] { "TenantId", "LoginProvider", "ProviderKey" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLogins_TenantId_UserId",
                table: "AbpUserLogins",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLoginAttempts_TenancyName_UserNameOrEmailAddress_Resu~",
                table: "AbpUserLoginAttempts",
                columns: new[] { "TenancyName", "UserNameOrEmailAddress", "Result" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLoginAttempts_UserId_TenantId",
                table: "AbpUserLoginAttempts",
                columns: new[] { "UserId", "TenantId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserClaims_TenantId_ClaimType",
                table: "AbpUserClaims",
                columns: new[] { "TenantId", "ClaimType" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserAccounts_TenantId_EmailAddress",
                table: "AbpUserAccounts",
                columns: new[] { "TenantId", "EmailAddress" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserAccounts_TenantId_UserId",
                table: "AbpUserAccounts",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserAccounts_TenantId_UserName",
                table: "AbpUserAccounts",
                columns: new[] { "TenantId", "UserName" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenantNotifications_TenantId",
                table: "AbpTenantNotifications",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpSettings_TenantId_Name_UserId",
                table: "AbpSettings",
                columns: new[] { "TenantId", "Name", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoles_TenantId_NormalizedName",
                table: "AbpRoles",
                columns: new[] { "TenantId", "NormalizedName" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoleClaims_TenantId_ClaimType",
                table: "AbpRoleClaims",
                columns: new[] { "TenantId", "ClaimType" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpPermissions_TenantId_Name",
                table: "AbpPermissions",
                columns: new[] { "TenantId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpNotificationSubscriptions_TenantId_NotificationName_Entit~",
                table: "AbpNotificationSubscriptions",
                columns: new[] { "TenantId", "NotificationName", "EntityTypeName", "EntityId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpLanguageTexts_TenantId_Source_LanguageName_Key",
                table: "AbpLanguageTexts",
                columns: new[] { "TenantId", "Source", "LanguageName", "Key" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpLanguages_TenantId_Name",
                table: "AbpLanguages",
                columns: new[] { "TenantId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChangeSets_TenantId_CreationTime",
                table: "AbpEntityChangeSets",
                columns: new[] { "TenantId", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChangeSets_TenantId_Reason",
                table: "AbpEntityChangeSets",
                columns: new[] { "TenantId", "Reason" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChangeSets_TenantId_UserId",
                table: "AbpEntityChangeSets",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpDynamicProperties_PropertyName_TenantId",
                table: "AbpDynamicProperties",
                columns: new[] { "PropertyName", "TenantId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpDynamicEntityProperties_EntityFullName_DynamicPropertyId_~",
                table: "AbpDynamicEntityProperties",
                columns: new[] { "EntityFullName", "DynamicPropertyId", "TenantId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpAuditLogs_TenantId_ExecutionDuration",
                table: "AbpAuditLogs",
                columns: new[] { "TenantId", "ExecutionDuration" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpAuditLogs_TenantId_ExecutionTime",
                table: "AbpAuditLogs",
                columns: new[] { "TenantId", "ExecutionTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpAuditLogs_TenantId_UserId",
                table: "AbpAuditLogs",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_CreationTime",
                table: "AbpTenants",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_CreatorUserId",
                table: "AbpTenants",
                column: "CreatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_DeleterUserId",
                table: "AbpTenants",
                column: "DeleterUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_LastModifierUserId",
                table: "AbpTenants",
                column: "LastModifierUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_TenancyName",
                table: "AbpTenants",
                column: "TenancyName");
        }
    }
}

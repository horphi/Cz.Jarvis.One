const Host = process.env.CZ_API_HOST || "https://localhost:44301";

export const TOKEN_AUTH = `${Host}/api/TokenAuth/Authenticate`;
export const LOG_OUT = `${Host}/api/TokenAuth/Logout`;

export const GET_CURRENT_LOGIN_INFORMATIONS = `${Host}/api/services/app/Session/GetCurrentLoginInformations`;

export const GET_ALL_PERMISSIONS = `${Host}/api/services/app/Permission/GetAllPermissions`;

// Role
export const GET_ROLES = `${Host}/api/services/app/Role/GetRoles`;
export const CREATE_OR_UPDATE_ROLE = `${Host}/api/services/app/Role/CreateOrUpdateRole`;
export const DELETE_ROLE = `${Host}/api/services/app/Role/DeleteRole`;
export const GET_ROLE_FOR_EDIT = `${Host}/api/services/app/Role/GetRoleForEdit`;

// User
export const GET_USERS = `${Host}/api/services/app/User/GetUsers`;
export const CREATE_OR_UPDATE_USER = `${Host}/api/services/app/User/CreateOrUpdateUser`;
export const DELETE_USER = `${Host}/api/services/app/User/DeleteUser`;
export const GET_USER_FOR_EDIT = `${Host}/api/services/app/User/GetUserForEdit`;
export const UNLOCK_USER = `${Host}/api/services/app/User/UnlockUser`;

// Profile
export const UPDATE_CURRENT_USER_PROFILE = `${Host}/api/services/app/Profile/UpdateCurrentUserProfile`;
export const CHANGE_PASSWORD = `${Host}/api/services/app/Profile/ChangePassword`;

// Impersonate
export const IMPERSONATE_USER = `${Host}/api/services/app/Account/ImpersonateUser`;
export const IMPERSONATED_AUTHENTICATION = `${Host}/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=`;
export const BACK_TO_IMPERSONATOR = `${Host}/api/services/app/Account/BackToImpersonator`;

// Audit Logs
export const GET_ALL_AUDIT_LOGS = `${Host}/api/services/app/AuditLog/GetAuditLogs`;
export const GetEntityChanges = `${Host}/api/services/app/AuditLog/GetEntityChanges`;
export const GetEntityProertyChanges = `${Host}/api/services/app/AuditLog/GetEntityPropertyChanges`;

// Entity Changes
export const GET_ENTITY_CHANGES = `${Host}/api/services/app/AuditLog/GetEntityChanges`;
export const GET_ENTITY_PROPERTY_CHANGES = `${Host}/api/services/app/AuditLog/GetEntityTypeChanges`;

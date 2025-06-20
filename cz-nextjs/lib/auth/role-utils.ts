/**
 * Utility functions for role-based access control
 */

/**
 * Check if user has a specific role (case-insensitive)
 * @param userRoles Array of user roles
 * @param requiredRole The role to check for
 * @returns boolean indicating if user has the role
 */
export function hasRole(
  userRoles: string[] | undefined,
  requiredRole: string
): boolean {
  if (!userRoles || !Array.isArray(userRoles)) {
    return false;
  }

  return userRoles.some(
    (role) => role.toLowerCase() === requiredRole.toLowerCase()
  );
}

/**
 * Check if user has any of the specified roles
 * @param userRoles Array of user roles
 * @param requiredRoles Array of roles to check for
 * @returns boolean indicating if user has any of the roles
 */
export function hasAnyRole(
  userRoles: string[] | undefined,
  requiredRoles: string[]
): boolean {
  if (!userRoles || !Array.isArray(userRoles) || !requiredRoles.length) {
    return false;
  }

  return requiredRoles.some((requiredRole) => hasRole(userRoles, requiredRole));
}

/**
 * Check if user is an admin (checks for 'admin', 'administrator', or 'Admin' roles)
 * @param userRoles Array of user roles
 * @returns boolean indicating if user is an admin
 */
export function isAdmin(userRoles: string[] | undefined): boolean {
  return hasAnyRole(userRoles, ["admin", "administrator", "Admin"]);
}

import { GET_USER_CONFIGURATION } from "@/config/endpoint";
import { getAuthSession } from "./session";

export interface AbpUserConfiguration {
  auth?: {
    grantedPermissions?: Record<string, string>;
    allPermissions?: Record<string, string>;
  };
  localization?: {
    currentCulture?: {
      name: string;
      displayName: string;
    };
  };
  setting?: {
    values?: Record<string, string>;
  };
  features?: {
    allFeatures?: Record<string, string>;
  };
}

/**
 * Fetches user configuration from the backend API
 * This should only be called on the server side
 */
export async function getUserConfiguration(): Promise<AbpUserConfiguration | null> {
  try {
    const session = await getAuthSession();

    // Check if session and accessToken are available
    if (!session || !session.accessToken) {
      return null;
    }

    // Make the Remote API request
    const response = await fetch(`${GET_USER_CONFIGURATION}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store", // Don't cache this in middleware
    });

    if (!response.ok) {
      console.error("Failed to fetch user configuration:", response.status);
      return null;
    }

    const responseData = await response.json();

    // The AbpUserConfiguration endpoint returns result.auth.grantedPermissions
    return responseData.result || null;
  } catch (error) {
    console.error("Error fetching user configuration:", error);
    return null;
  }
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  grantedPermissions: Record<string, string> | undefined,
  permission: string
): boolean {
  if (!grantedPermissions) return false;
  return !!grantedPermissions[permission];
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  grantedPermissions: Record<string, string> | undefined,
  permissions: string[]
): boolean {
  if (!grantedPermissions || permissions.length === 0) return false;
  return permissions.some((permission) => hasPermission(grantedPermissions, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  grantedPermissions: Record<string, string> | undefined,
  permissions: string[]
): boolean {
  if (!grantedPermissions || permissions.length === 0) return false;
  return permissions.every((permission) => hasPermission(grantedPermissions, permission));
}

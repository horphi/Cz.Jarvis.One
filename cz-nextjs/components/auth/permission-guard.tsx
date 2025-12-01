"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface PermissionGuardProps {
  children: React.ReactNode;
  /**
   * Required permission to access this page
   */
  requiredPermission?: string;
  /**
   * Array of permissions - user needs ANY of these permissions
   */
  requiredPermissions?: string[];
  /**
   * Array of permissions - user needs ALL of these permissions
   */
  requireAllPermissions?: string[];
  /**
   * Where to redirect if user doesn't have permission
   * @default "/unauthorized"
   */
  redirectTo?: string;
  /**
   * Custom fallback component to show while loading
   */
  loadingFallback?: React.ReactNode;
  /**
   * Custom component to show when access is denied (instead of redirecting)
   */
  accessDeniedFallback?: React.ReactNode;
}

/**
 * PermissionGuard - Wraps a page to enforce permission-based access control
 *
 * Usage:
 * ```tsx
 * export default function UsersPage() {
 *   return (
 *     <PermissionGuard requiredPermission="Pages.Administration.Users">
 *       <div>Your page content</div>
 *     </PermissionGuard>
 *   );
 * }
 * ```
 */
export function PermissionGuard({
  children,
  requiredPermission,
  requiredPermissions,
  requireAllPermissions,
  redirectTo = "/unauthorized",
  loadingFallback,
  accessDeniedFallback,
}: PermissionGuardProps) {
  const { isLoading, hasPermission, session } = useAuth();
  const router = useRouter();

  // Check if user has access
  const hasAccess = () => {
    // If no permissions specified, allow access
    if (!requiredPermission && !requiredPermissions && !requireAllPermissions) {
      return true;
    }

    // Check single permission
    if (requiredPermission) {
      return hasPermission(requiredPermission);
    }

    // Check if user has ANY of the required permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      return requiredPermissions.some((perm) => hasPermission(perm));
    }

    // Check if user has ALL of the required permissions
    if (requireAllPermissions && requireAllPermissions.length > 0) {
      return requireAllPermissions.every((perm) => hasPermission(perm));
    }

    return false;
  };

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // If user doesn't have access and no custom fallback, redirect
    if (!hasAccess() && !accessDeniedFallback) {
      console.warn(
        `Permission denied. Required: ${requiredPermission || requiredPermissions?.join(", ") || requireAllPermissions?.join(", ")}`
      );
      router.push(redirectTo);
    }
  }, [isLoading, session, requiredPermission, requiredPermissions, requireAllPermissions, redirectTo, router, accessDeniedFallback]);

  // Show loading state
  if (isLoading) {
    return (
      loadingFallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    );
  }

  // Show access denied fallback if provided
  if (!hasAccess() && accessDeniedFallback) {
    return <>{accessDeniedFallback}</>;
  }

  // Show content if user has access
  if (hasAccess()) {
    return <>{children}</>;
  }

  // Otherwise show nothing (will redirect in useEffect)
  return null;
}

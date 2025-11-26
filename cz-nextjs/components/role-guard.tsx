"use client";

import { useAuth } from '@/hooks/use-auth'
import { ReactNode } from 'react'

interface RoleGuardProps {
    /**
     * Roles required to see the content. If user has any of these roles, content will be shown
     */
    requiredRoles?: string[]
    /**
     * Specific role required (alternative to requiredRoles for single role)
     */
    role?: string
    /**
     * Permissions required to see the content. If user has any of these permissions, content will be shown
     */
    requiredPermissions?: string[]
    /**
     * Specific permission required (alternative to requiredPermissions for single permission)
     */
    permission?: string
    /**
     * If true, requires admin access
     */
    requireAdmin?: boolean
    /**
     * Content to show when user has required access
     */
    children: ReactNode
    /**
     * Optional fallback content to show when user doesn't have access
     */
    fallback?: ReactNode
    /**
     * If true, shows nothing when user doesn't have access (instead of fallback)
     */
    hideWhenNoAccess?: boolean
}

/**
 * Component that conditionally renders content based on user roles and permissions
 * 
 * @example
 * ```tsx
 * <RoleGuard requireAdmin>
 *   <AdminPanel />
 * </RoleGuard>
 * 
 * <RoleGuard requiredRoles={['admin', 'moderator']} fallback={<div>Access denied</div>}>
 *   <ModeratorContent />
 * </RoleGuard>
 * 
 * <RoleGuard permission="Pages.Administration.Users" hideWhenNoAccess>
 *   <UserManagement />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
    requiredRoles = [],
    role,
    requiredPermissions = [],
    permission,
    requireAdmin = false,
    children,
    fallback = <div className="text-gray-500 text-sm">Access denied</div>,
    hideWhenNoAccess = false
}: RoleGuardProps) {
    const { session, isLoading, hasPermission } = useAuth()

    // Show nothing while loading initial session
    // If refetching (isLoading=true but session exists), keep showing content
    if (isLoading && !session) {
        return null
    }

    // Check if user is logged in
    if (!session?.isLoggedIn) {
        return hideWhenNoAccess ? null : fallback
    }

    // Build the roles to check
    const rolesToCheck = [
        ...requiredRoles,
        ...(role ? [role] : []),
        ...(requireAdmin ? ['admin', 'administrator'] : [])
    ]

    // Build permissions to check
    const permissionsToCheck = [
        ...requiredPermissions,
        ...(permission ? [permission] : [])
    ]

    // If no roles or permissions specified, show content (public access)
    if (rolesToCheck.length === 0 && permissionsToCheck.length === 0) {
        return <>{children}</>
    }

    // Check if user has any of the required roles
    const hasRoleAccess = rolesToCheck.length > 0 && rolesToCheck.some(requiredRole =>
        session.userRole?.some(userRole =>
            userRole.toLowerCase() === requiredRole.toLowerCase()
        )
    )

    // Check if user has any of the required permissions
    const hasPermissionAccess = permissionsToCheck.length > 0 && permissionsToCheck.some(requiredPermission =>
        hasPermission(requiredPermission)
    )

    // If roles are specified, they must be met. If permissions are specified, they must be met.
    // If both are specified, usually one or the other is sufficient, or both?
    // Let's assume OR logic between roles and permissions for flexibility, 
    // unless the user specifically wants AND. 
    // However, typically RoleGuard is used for one type of check.
    // If both are provided, let's say access is granted if EITHER role OR permission is satisfied.

    // Wait, if rolesToCheck is empty, hasRoleAccess is false.
    // If permissionsToCheck is empty, hasPermissionAccess is false.

    // Correct logic:
    // If only roles provided: check roles
    // If only permissions provided: check permissions
    // If both provided: check if (hasRole OR hasPermission)

    let hasAccess = false;

    if (rolesToCheck.length > 0 && permissionsToCheck.length > 0) {
        hasAccess = hasRoleAccess || hasPermissionAccess;
    } else if (rolesToCheck.length > 0) {
        hasAccess = hasRoleAccess;
    } else if (permissionsToCheck.length > 0) {
        hasAccess = hasPermissionAccess;
    }

    if (hasAccess) {
        return <>{children}</>
    }

    return hideWhenNoAccess ? null : fallback
}

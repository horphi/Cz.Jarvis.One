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
 * Component that conditionally renders content based on user roles
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
 * <RoleGuard role="user" hideWhenNoAccess>
 *   <UserOnlyButton />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
    requiredRoles = [],
    role,
    requireAdmin = false,
    children,
    fallback = <div className="text-gray-500 text-sm">Access denied</div>,
    hideWhenNoAccess = false
}: RoleGuardProps) {
    const { session, isLoading } = useAuth()

    // Show nothing while loading
    if (isLoading) {
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

    // If no roles specified, show content (public access)
    if (rolesToCheck.length === 0) {
        return <>{children}</>
    }

    // Check if user has any of the required roles
    const hasAccess = rolesToCheck.some(requiredRole =>
        session.userRole?.some(userRole =>
            userRole.toLowerCase() === requiredRole.toLowerCase()
        )
    )

    if (hasAccess) {
        return <>{children}</>
    }

    return hideWhenNoAccess ? null : fallback
}

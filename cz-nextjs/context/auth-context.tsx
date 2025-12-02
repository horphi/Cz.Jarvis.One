"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { hasAnyRole, hasRole, isAdmin } from "@/lib/auth/role-utils";

interface UserSession {
    isLoggedIn: boolean;
    userId?: string;
    userName?: string;
    userRole?: string[];
    grantedPermissions?: Record<string, string>; // Permissions are usually returned as a map or list. Abp returns a map "PermissionName": "true"
    firstName?: string;
    lastName?: string;
    email?: string;
    isImpersonating?: boolean;
    originalUserId?: string;
    originalUserName?: string;
}

interface UseAuthReturn {
    session: UserSession | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasPermission: (permission: string) => boolean;
    isGranted: (permission: string) => boolean; // Alias for hasPermission
    isAdmin: () => boolean;
    isImpersonating: boolean;
    refetch: () => Promise<void>;
}

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

/**
 * AuthProvider component that manages authentication state globally
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSession = useCallback(async () => {
        try {
            // Fetch session data (now includes permissions from server)
            const sessionResponse = await fetch("/api/auth/session");
            if (sessionResponse.ok) {
                const sessionData = await sessionResponse.json();

                // Permissions are now included in the session response
                // No need to fetch user-configuration separately
                setSession(sessionData);
            } else {
                setSession({ isLoggedIn: false });
            }
        } catch (error) {
            console.error("useAuth - Error fetching session:", error);
            setSession({ isLoggedIn: false });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        await fetchSession();
    }, [fetchSession]);

    const hasPermission = useCallback((permission: string) => {
        if (!session?.grantedPermissions) return false;
        return !!session.grantedPermissions[permission];
    }, [session]);

    const contextValue: UseAuthReturn = {
        session,
        isLoading,
        isLoggedIn: session?.isLoggedIn ?? false,
        hasRole: (role: string) => hasRole(session?.userRole, role),
        hasAnyRole: (roles: string[]) => hasAnyRole(session?.userRole, roles),
        hasPermission,
        isGranted: hasPermission,
        isAdmin: () => isAdmin(session?.userRole),
        isImpersonating: session?.isImpersonating ?? false,
        refetch,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook for authentication and role checking
 */
export function useAuth(): UseAuthReturn {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

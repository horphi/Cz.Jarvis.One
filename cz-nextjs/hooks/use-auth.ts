"use client";

import { useState, useEffect, useCallback } from "react";
import { hasAnyRole, hasRole, isAdmin } from "@/lib/auth/role-utils";

interface UserSession {
  isLoggedIn: boolean;
  userId?: string;
  userName?: string;
  userRole?: string[];
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
  isAdmin: () => boolean;
  isImpersonating: boolean;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for authentication and role checking
 */
export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const sessionData = await response.json();
        console.log("🔍 useAuth - Session data received:", sessionData);
        console.log("🔍 useAuth - User roles:", sessionData?.userRole);
        console.log(
          "🔍 useAuth - Is impersonating:",
          sessionData?.isImpersonating
        );
        setSession(sessionData);
      } else {
        console.log("❌ useAuth - Session fetch failed:", response.status);
        setSession({ isLoggedIn: false });
      }
    } catch (error) {
      console.error("❌ useAuth - Error fetching session:", error);
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
  return {
    session,
    isLoading,
    isLoggedIn: session?.isLoggedIn ?? false,
    hasRole: (role: string) => hasRole(session?.userRole, role),
    hasAnyRole: (roles: string[]) => hasAnyRole(session?.userRole, roles),
    isAdmin: () => isAdmin(session?.userRole),
    isImpersonating: session?.isImpersonating ?? false,
    refetch,
  };
}

import { useState, useEffect } from "react";
import { hasAnyRole, hasRole, isAdmin } from "@/lib/auth/role-utils";

interface UserSession {
  isLoggedIn: boolean;
  userId?: string;
  userName?: string;
  userRole?: string[];
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface UseAuthReturn {
  session: UserSession | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for authentication and role checking
 */
export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const sessionData = await response.json();
        setSession(sessionData);
      } else {
        setSession({ isLoggedIn: false });
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      setSession({ isLoggedIn: false });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    await fetchSession();
  };

  return {
    session,
    isLoading,
    isLoggedIn: session?.isLoggedIn ?? false,
    hasRole: (role: string) => hasRole(session?.userRole, role),
    hasAnyRole: (roles: string[]) => hasAnyRole(session?.userRole, roles),
    isAdmin: () => isAdmin(session?.userRole),
    refetch,
  };
}

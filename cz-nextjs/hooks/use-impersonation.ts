"use client";

import { useState } from "react";

interface ImpersonationState {
  isLoading: boolean;
  error: string | null;
}

interface UseImpersonationReturn {
  impersonationState: ImpersonationState;
  startImpersonation: (userId: string) => Promise<boolean>;
  endImpersonation: () => Promise<boolean>;
}

/**
 * Custom hook for user impersonation functionality
 */
export function useImpersonation(): UseImpersonationReturn {
  const [impersonationState, setImpersonationState] =
    useState<ImpersonationState>({
      isLoading: false,
      error: null,
    });

  const startImpersonation = async (userId: string): Promise<boolean> => {
    if (!userId.trim()) {
      setImpersonationState({
        isLoading: false,
        error: "User ID is required",
      });
      return false;
    }

    setImpersonationState({
      isLoading: true,
      error: null,
    });

    try {
      const response = await fetch("/api/auth/impersonate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setImpersonationState({
          isLoading: false,
          error: null,
        });

        // Reload the page to refresh all components with new session
        window.location.reload();
        return true;
      } else {
        setImpersonationState({
          isLoading: false,
          error: data.error || "Failed to start impersonation",
        });
        return false;
      }
    } catch (error) {
      console.error("Start impersonation error:", error);
      setImpersonationState({
        isLoading: false,
        error: "An unexpected error occurred",
      });
      return false;
    }
  };

  const endImpersonation = async (): Promise<boolean> => {
    setImpersonationState({
      isLoading: true,
      error: null,
    });

    try {
      const response = await fetch("/api/auth/end-impersonation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setImpersonationState({
          isLoading: false,
          error: null,
        });

        // Reload the page to refresh all components with original session
        window.location.reload();
        return true;
      } else {
        setImpersonationState({
          isLoading: false,
          error: data.error || "Failed to end impersonation",
        });
        return false;
      }
    } catch (error) {
      console.error("End impersonation error:", error);
      setImpersonationState({
        isLoading: false,
        error: "An unexpected error occurred",
      });
      return false;
    }
  };

  return {
    impersonationState,
    startImpersonation,
    endImpersonation,
  };
}

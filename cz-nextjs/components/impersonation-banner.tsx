"use client";

import { useAuth } from '@/hooks/use-auth'
import { useImpersonation } from '@/hooks/use-impersonation'
import { Button } from '@/components/ui/button'
import { IconUserOff, IconLoader } from '@tabler/icons-react'

/**
 * Banner component that shows when user is impersonating another user
 * Provides option to end impersonation
 */
export function ImpersonationBanner() {
    const { session, isImpersonating } = useAuth()
    const { impersonationState, endImpersonation } = useImpersonation()

    if (!isImpersonating || !session?.originalUserName) {
        return null
    }

    const handleEndImpersonation = async () => {
        await endImpersonation()
    }

    return (
        <div className="fixed top-16 left-0 right-0 border border-orange-200 bg-orange-50 text-orange-800 p-3 z-40 shadow-md">
            <div className="flex items-center justify-between max-w-full mx-auto">
                <div className="flex items-center min-w-0 flex-1">
                    <IconUserOff className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                        You are impersonating <strong>{session.userName}</strong>
                        {session.originalUserName && (
                            <span className="hidden sm:inline"> (Original user: {session.originalUserName})</span>
                        )}
                    </span>
                </div>                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleEndImpersonation}
                    disabled={impersonationState.isLoading}
                    className="ml-4 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 flex-shrink-0 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                    {impersonationState.isLoading ? (
                        <>
                            <IconLoader className="mr-1 h-3 w-3 animate-spin" />
                            <span className="hidden sm:inline">Ending...</span>
                        </>
                    ) : (
                        <>
                            <span className="hidden sm:inline">End Impersonation</span>
                            <span className="sm:hidden">End</span>
                        </>
                    )}
                </Button>
            </div>
            {impersonationState.error && (
                <div className="mt-2 text-red-600 text-sm">
                    Error: {impersonationState.error}
                </div>
            )}
        </div>
    )
}

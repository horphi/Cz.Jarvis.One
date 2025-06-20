"use client";

import { useAuth } from '@/hooks/use-auth'
import { useImpersonation } from '@/hooks/use-impersonation'
import { Button } from '@/components/ui/button'
import { IconUserOff, IconLoader, IconX } from '@tabler/icons-react'

/**
 * Sticky banner component that shows when user is impersonating another user
 * This version is designed to work better with the sidebar layout
 */
export function StickyImpersonationBanner() {
    const { session, isImpersonating } = useAuth()
    const { impersonationState, endImpersonation } = useImpersonation()

    if (!isImpersonating || !session?.originalUserName) {
        return null
    }

    const handleEndImpersonation = async () => {
        await endImpersonation()
    }

    return (
        <div className="sticky top-0 z-30 border-b-2 border-orange-200 bg-orange-50 text-orange-800 shadow-sm">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center min-w-0 flex-1">
                    <IconUserOff className="h-4 w-4 mr-2 flex-shrink-0 text-orange-600" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                            Impersonating: <span className="font-bold">{session.userName}</span>
                        </p>
                        {session.originalUserName && (
                            <p className="text-xs text-orange-600 truncate">
                                Original user: {session.originalUserName}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleEndImpersonation}
                    disabled={impersonationState.isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                    {impersonationState.isLoading ? (
                        <>
                            <IconLoader className="mr-1 h-3 w-3 animate-spin" />
                            <span className="hidden sm:inline">Ending...</span>
                        </>
                    ) : (
                        <>
                            <IconX className="sm:hidden h-3 w-3" />
                            <span className="hidden sm:inline">End Impersonation</span>
                        </>
                    )}
                </Button>
                </div>
            </div>
            {impersonationState.error && (
                <div className="px-3 pb-2">
                    <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded p-2">
                        Error: {impersonationState.error}
                    </div>
                </div>
            )}
        </div>
    )
}

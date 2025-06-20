"use client";

import { useAuth } from '@/hooks/use-auth'
import { ReactNode } from 'react'

interface ContentWrapperProps {
    children: ReactNode
}

/**
 * Wrapper component that provides proper spacing for content
 * when impersonation banner is active
 */
export function ContentWrapper({ children }: ContentWrapperProps) {
    const { isImpersonating } = useAuth()

    return (
        <div className={`
      ${isImpersonating ? 'pt-20' : 'pt-16'} 
      transition-all duration-200 ease-in-out
      min-h-[calc(100vh-4rem)]
    `}>
            <div className="p-4">
                {children}
            </div>
        </div>
    )
}

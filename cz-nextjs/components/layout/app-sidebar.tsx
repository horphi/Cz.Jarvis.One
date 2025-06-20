'use client'

import { useEffect, useState } from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '../ui/sidebar'

import { navGroupData } from './data/nav-group'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { navTeamData } from './data/nav-team'
import { NavGroup as NavGroupType } from './types'
import { hasAnyRole } from '@/lib/auth/role-utils'


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [filteredNavGroups, setFilteredNavGroups] = useState<NavGroupType[]>(navGroupData)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await fetch('/api/auth/session')
                if (response.ok) {
                    const sessionData = await response.json()

                    // Filter navigation groups based on user roles
                    const filtered = navGroupData.filter(group => {
                        // If group has role requirements, check if user has any of them
                        if (group.requiredRoles && group.requiredRoles.length > 0) {
                            return hasAnyRole(sessionData?.userRole, group.requiredRoles)
                        }
                        // If no role requirements, show the group
                        return true
                    })

                    setFilteredNavGroups(filtered)
                } else {
                    // If session fetch fails, show only groups without role requirements (safer fallback)
                    const filtered = navGroupData.filter(group => !group.requiredRoles || group.requiredRoles.length === 0)
                    setFilteredNavGroups(filtered)
                }
            } catch (error) {
                console.error('Error fetching user session:', error)
                // On error, show only groups without role requirements (safer fallback)
                const filtered = navGroupData.filter(group => !group.requiredRoles || group.requiredRoles.length === 0)
                setFilteredNavGroups(filtered)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserSession()
    }, [])

    // Show skeleton or loading state while fetching session
    if (isLoading) {
        return (
            <Sidebar collapsible='icon' variant='floating' {...props}>
                <SidebarHeader>
                    <TeamSwitcher teams={navTeamData} />
                </SidebarHeader>
                <SidebarContent>
                    {/* Show loading skeleton or placeholder */}
                    <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        )
    }

    return (
        <Sidebar collapsible='icon' variant='floating' {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={navTeamData} />
            </SidebarHeader>
            <SidebarContent>
                {filteredNavGroups.map((props) => (
                    <NavGroup key={props.title} {...props} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

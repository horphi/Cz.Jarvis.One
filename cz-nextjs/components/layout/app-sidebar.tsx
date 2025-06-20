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
import { useAuth } from '@/hooks/use-auth'


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [filteredNavGroups, setFilteredNavGroups] = useState<NavGroupType[]>(navGroupData)
    const { session, isLoading } = useAuth()

    useEffect(() => {
        if (!isLoading && session) {
            // Filter navigation groups based on user roles
            const filtered = navGroupData.filter(group => {
                // If group has role requirements, check if user has any of them
                if (group.requiredRoles && group.requiredRoles.length > 0) {
                    return hasAnyRole(session?.userRole, group.requiredRoles)
                }
                // If no role requirements, show the group
                return true
            })
            setFilteredNavGroups(filtered)
        } else if (!isLoading && !session?.isLoggedIn) {
            // If no session, show only groups without role requirements (safer fallback)
            const filtered = navGroupData.filter(group => !group.requiredRoles || group.requiredRoles.length === 0)
            setFilteredNavGroups(filtered)
        }
    }, [session, isLoading])

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

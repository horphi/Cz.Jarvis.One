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
import { navUserData } from './data/nav-user'
import { TeamSwitcher } from './team-switcher'
import { navTeamData } from './data/nav-team'
import { AuthSessionData } from '@/types/sessions/auth-session'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [userData, setUserData] = useState(navUserData)

    useEffect(() => {
        // Fetch session data when component mounts
        const fetchSessionData = async () => {
            try {
                const response = await fetch('/api/auth/session', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch session data')
                }

                const session: AuthSessionData = await response.json()

                if (session.isLoggedIn) {
                    // Create a full name from firstName and lastName
                    const fullName = [session.firstName, session.lastName]
                        .filter(Boolean)
                        .join(' ') || 'User'

                    // Update user data with actual session data
                    setUserData({
                        name: fullName,
                        email: session.email || '',
                        avatar: '/avatars/default.svg', // Use default avatar or could be from session if available
                    })
                }
            } catch (error) {
                console.error('Error fetching session data:', error)
            }
        }

        fetchSessionData()
    }, [])

    return (
        <Sidebar collapsible='icon' variant='floating' {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={navTeamData} />
            </SidebarHeader>
            <SidebarContent>
                {navGroupData.map((props) => (
                    <NavGroup key={props.title} {...props} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

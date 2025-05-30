'use client'

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LockKeyhole,
    LogOut,
    Sparkles,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '../ui/sidebar'
import { useRouter } from 'next/navigation'
import { MyProfileDialog } from '../../app/(webapp)/administration/profile/component/my-profile-dialog'
import { useAppContext } from '@/context/app-context'
import { TUserSession } from '@/types/users/user-type'
import { ApiResult } from '@/types/http/api-result'
//import { AuthService } from '@/app/services/auth/AuthService'
import { toast } from 'sonner'
import { ChangePasswordDialog } from '@/app/(webapp)/administration/profile/component/change-password-dialog'

export function NavUser() {
    const { isMobile } = useSidebar()
    const router = useRouter()
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false)
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { userSession, setUserSession } = useAppContext();



    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        } catch (error) {
            console.error("Logout failed", error);
            throw new Error("Logout failed. Please try again.");
        }

    }

    useEffect(() => {
        // Fetch session data when component mounts
        const fetchSessionData = async () => {
            try {
                // Fetch the current user session data
                const response = await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const responseResult: ApiResult<TUserSession> = await response.json();
                if (!response.ok) {
                    if (responseResult.message === "Authentication required") {
                        // If authentication is required, redirect to login
                        router.push('/login');
                    } else {
                        // Handle other errors
                        toast.error(responseResult.message || "Failed to fetch user session");
                        throw new Error(responseResult.message || "Failed to fetch user session");
                    }
                }
                // Set the user session in context
                setUserSession(responseResult.data?.user || null);

            } catch (error) {
                console.error("Failed to fetch user", error);
                handleLogout();
            } finally {
                //setLoading(false);
            }
        }
        fetchSessionData();
    }, [setUserSession, router]); // Add dependency array - Note: Removed setLoginType as it was not defined in the snippet. If it's defined elsewhere and needed, please re-add.

    const handleChangePasswordItemSelect = () => {
        setIsChangePasswordDialogOpen(true); // Explicitly close the profile dialog
        setIsDropdownOpen(false); // Explicitly close the dropdown
    };

    const handleProfileItemSelect = () => {
        setIsProfileDialogOpen(true);
        setIsDropdownOpen(false); // Explicitly close the dropdown
    };

    const handleLogoutItemSelect = () => {
        handleLogout();
        setIsDropdownOpen(false); // Explicitly close the dropdown
    };

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size='lg'
                                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                            >
                                <Avatar className='h-8 w-8 rounded-lg'>
                                    <AvatarImage src={`/avatars/default.svg`} alt={userSession?.name} />
                                    <AvatarFallback className='rounded-lg'>RR</AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-semibold'>{userSession?.name || ''}</span>
                                    <span className='truncate text-xs'>{userSession?.emailAddress || ''}</span>
                                </div>
                                <ChevronsUpDown className='ml-auto size-4' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg relative z-50'
                            side={isMobile ? 'bottom' : 'right'}
                            align='end'
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className='p-0 font-normal'>
                                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                    <Avatar className='h-8 w-8 rounded-lg'>
                                        <AvatarImage src={`/avatars/default.svg`} alt={userSession?.name} />
                                        <AvatarFallback className='rounded-lg'>RR</AvatarFallback>
                                    </Avatar>
                                    <div className='grid flex-1 text-left text-sm leading-tight'>
                                        <span className='truncate font-semibold'>{userSession?.name}</span>
                                        <span className='truncate text-xs'>{userSession?.emailAddress}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={handleProfileItemSelect}>
                                    <BadgeCheck className="mr-2 h-4 w-4" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={handleChangePasswordItemSelect}>
                                    <LockKeyhole className="mr-2 h-4 w-4" />
                                    Change Password
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => setIsDropdownOpen(false)}>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Upgrade to Pro
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => setIsDropdownOpen(false)}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setIsDropdownOpen(false)}>
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notifications
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={handleLogoutItemSelect}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <MyProfileDialog
                open={isProfileDialogOpen}
                onOpenChange={setIsProfileDialogOpen}
            />

            <ChangePasswordDialog
                open={isChangePasswordDialogOpen}
                onOpenChange={setIsChangePasswordDialogOpen}
            />
        </>
    )
}

"use client";

import { useState } from 'react'
import { useImpersonation } from '@/hooks/use-impersonation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { IconUserOff, IconLoader } from '@tabler/icons-react'

interface ImpersonationDialogProps {
    trigger?: React.ReactNode
}

/**
 * Dialog component for starting user impersonation
 * Only available to admin users
 */
export function ImpersonationDialog({ trigger }: ImpersonationDialogProps) {
    const [open, setOpen] = useState(false)
    const [userId, setUserId] = useState('')
    const { isAdmin } = useAuth()
    const { impersonationState, startImpersonation } = useImpersonation()

    // Only show to admin users
    if (!isAdmin()) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!userId.trim()) {
            return
        }

        const success = await startImpersonation(userId.trim())
        if (success) {
            setOpen(false)
            setUserId('')
        }
    }

    const handleCancel = () => {
        setOpen(false)
        setUserId('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <IconUserOff className="mr-2 h-4 w-4" />
                        Impersonate User
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Impersonate User</DialogTitle>
                        <DialogDescription>
                            Enter the User ID of the user you want to impersonate. This will log you in as that user temporarily.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="userId" className="text-right">
                                User ID
                            </Label>
                            <Input
                                id="userId"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter user ID..."
                                className="col-span-3"
                                disabled={impersonationState.isLoading}
                                required
                            />
                        </div>
                        {impersonationState.error && (
                            <div className="text-red-600 text-sm mt-2">
                                Error: {impersonationState.error}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={impersonationState.isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={impersonationState.isLoading || !userId.trim()}
                        >
                            {impersonationState.isLoading ? (
                                <>
                                    <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                                    Starting...
                                </>
                            ) : (
                                'Start Impersonation'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

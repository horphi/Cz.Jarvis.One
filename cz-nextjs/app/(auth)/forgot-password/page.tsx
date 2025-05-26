'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import AuthLayout from '@/components/layout/auth-layout'
import { ForgotForm } from './components/forgot-password-form'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

export default function ForgotPassword() {
    return (
        <AuthLayout>
            <Link
                href="/login"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-4 top-4 md:left-8 md:top-8"
                )}
            >
                <>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </>
            </Link>
            <Card className='p-6 relative'>

                <div className='mb-2 flex flex-col space-y-2 text-center pt-10'>
                    <h1 className='text-md font-semibold tracking-tight'>
                        Forgot Password
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter your registered email and we will send you a link to
                        reset your password. If you don&apos;t receive the email, please check your spam folder or retry after some time.
                    </p>
                </div>
                <ForgotForm />
            </Card>
        </AuthLayout >
    )
}

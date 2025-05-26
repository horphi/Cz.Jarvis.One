'use client'

import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { IconAlertCircle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { toast } from "sonner"

// Add interface for translations
interface Translations {
    auth: {
        login: string;
        username: string;
        password: string;
        forgotPassword: string;
        errors?: {
            usernameRequired?: string;
            usernameInvalid?: string;
            passwordRequired?: string;
            passwordLength?: string;
        };
    };
    [key: string]: unknown;
}

type UserAuthFormProps = HTMLAttributes<HTMLDivElement> & {
    translations: Translations;
}

export function UserAuthForm({ className, translations, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Default error messages that will be used if translations are not available
    const defaultErrorMessages = {
        usernameRequired: 'Please enter your username',
        usernameInvalid: 'Invalid username address',
        passwordRequired: 'Please enter your password',
        passwordLength: 'Password must be at least 6 characters long'
    };

    // Use translated error messages if available, otherwise fallback to defaults
    const errorMessages = {
        usernameRequired: translations.auth.errors?.usernameRequired || defaultErrorMessages.usernameRequired,
        usernameInvalid: translations.auth.errors?.usernameInvalid || defaultErrorMessages.usernameInvalid,
        passwordRequired: translations.auth.errors?.passwordRequired || defaultErrorMessages.passwordRequired,
        passwordLength: translations.auth.errors?.passwordLength || defaultErrorMessages.passwordLength
    };

    const formSchema = z.object({
        username: z
            .string()
            .min(1, { message: errorMessages.usernameRequired }),
        password: z
            .string()
            .min(1, {
                message: errorMessages.passwordRequired,
            })
            .min(6, {
                message: errorMessages.passwordLength,
            }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setErrorMessage(null) // Clear previous errors

        console.log('Form submitted with data:', data);

        try {
            // Send POST request to the API endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const result = await response.json();
                // Handle successful login
                console.log('Login successful:', result);

                toast.success('Login successful! Redirecting...');
                // Redirect to dashboard after successful login
                window.location.href = '/dashboard';
            }
            else {
                const error = await response.json();
                // Handle error response
                console.error('Login failed:', error);

                // Set error message for in-form display
                const displayMessage = error.message || 'Login failed. Please check your credentials and try again.';
                setErrorMessage(displayMessage);

                // Show toast notification with error message
                toast.error(displayMessage);
            }
        } catch (e) {
            // Handle error
            console.error(e);

            const genericError = 'An error occurred during login. Please try again.';
            setErrorMessage(genericError);
            // Show generic error toast
            toast.error(genericError);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='grid gap-2'>
                        {errorMessage && (
                            <div className='p-3 rounded-md bg-red-50 border border-red-200 mb-4'>
                                <div className='flex items-center gap-2 text-red-800'>
                                    <IconAlertCircle className='h-4 w-4' />
                                    <span className='text-sm font-medium'>{errorMessage}</span>
                                </div>
                            </div>
                        )}

                        <div className='mb-4'>
                            <FormField
                                control={form.control}
                                name='username'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <FormLabel>{translations.auth.username}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={translations.auth.username} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='mb-4'>
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <div className='flex items-center justify-between'>
                                            <FormLabel>{translations.auth.password}</FormLabel>
                                        </div>
                                        <FormControl>
                                            <PasswordInput placeholder={translations.auth.password} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button className='mt-2' disabled={isLoading}>
                            {isLoading ? 'Logging in...' : translations.auth.login}
                        </Button>

                        <div className='flex items-center justify-between'>
                            <Link
                                href='/forgot-password'
                                className='text-sm font-medium text-muted-foreground hover:opacity-75'
                            >
                                {translations.auth.forgotPassword}
                            </Link>
                        </div>

                        {/* <div className='relative my-2 invisible'>
                            <div className='absolute inset-0 flex items-center'>
                                <span className='w-full border-t' />
                            </div>
                            <div className='relative flex justify-center text-xs uppercase'>
                                <span className='bg-background px-2 text-muted-foreground'>
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className='flex items-center gap-2 invisible'>
                            <Button
                                variant='outline'
                                className='w-1/2'
                                type='button'
                                disabled={isLoading}
                            >
                                <IconBrandGithub className='h-4 w-4' /> GitHub
                            </Button>
                            <Button
                                variant='outline'
                                className='w-1/2'
                                type='button'
                                disabled={isLoading}
                            >
                                <IconBrandFacebook className='h-4 w-4' /> Facebook
                            </Button>
                        </div> */}
                    </div>
                </form>
            </Form>
        </div>
    )
}

import LanguageSwitcher from "@/components/language-switch";
import { Card } from "@/components/ui/card";
import { getLocale, getTranslations } from "@/lib/i18n";
import AuthLayout from '@/components/layout/auth-layout'
import { UserAuthForm } from "./components/user-auth-form";

export default async function LoginPage() {
    const locale = await getLocale();
    const t = await getTranslations(locale);
    return (
        <AuthLayout>
            <Card className='p-6'>
                <div className='w-full flex justify-end mb-2'>
                    <LanguageSwitcher currentLocale={locale} />
                </div>
                <div className='flex flex-col space-y-2 text-left items-center-safe'>
                    <h1 className='text-2xl font-semibold tracking-tight'>{t.auth.login}
                    </h1>
                    <p className='text-sm text-muted-foreground invisible'>
                        Enter your email and password below <br />
                        to log into your account
                    </p>
                </div>
                <UserAuthForm translations={t} />
                <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
                    By clicking login, you agree to our{' '}
                    <a
                        href='/terms'
                        className='underline underline-offset-4 hover:text-primary'
                    >
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                        href='/privacy'
                        className='underline underline-offset-4 hover:text-primary'
                    >
                        Privacy Policy
                    </a>
                    .
                </p>
            </Card>
        </AuthLayout>
    )
}
'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { supportedLocales } from '@/lib/supportedLanguage';
import { IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';


// Define the props for the component
interface LanguageSwitcherProps {
    currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
    const router = useRouter();

    const changeLanguage = (locale: string) => {
        // Set a cookie to remember the selected language, expires in 1 year
        Cookies.set('NEXT_LOCALE', locale, { expires: 365 });
        // Refresh the page to apply the new language
        router.refresh();
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-9 w-9 flex items-center justify-center'>
                    <Image src="/globe.svg" alt="Language" width={24} height={24} />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {supportedLocales.map((locale) => (
                    <DropdownMenuItem key={locale} onClick={() => changeLanguage(locale)}>
                        {locale.toUpperCase()}
                        <IconCheck
                            size={14}
                            className={cn('ml-auto', currentLocale !== locale && 'hidden')}
                        />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ThemeProvider } from 'next-themes'
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { ThemeSwitch } from '@/components/theme-switch';
import LanguageSwitcher from '@/components/language-switch';
import { getLocale } from '@/lib/i18n';
import { TopNav } from '@/components/layout/top-nav';
import { topNavData } from './top-nav-data';
import { AppProvider } from '@/context/app-context';


const inter = Inter({ subsets: ['latin'] })


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const locale = await getLocale();
    //const t = await getTranslations(locale);

    return (
        <AppProvider>
            <div className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div>
                        <SidebarProvider>
                            {/* <SearchProvider> */}
                            <AppSidebar />
                            <div
                                id='content'
                                className={cn(
                                    'max-w-full w-full ml-auto',
                                    'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                                    'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                                    'transition-[width] ease-linear duration-200',
                                    'h-svh flex flex-col',
                                    'group-data-[scroll-locked=1]/body:h-full',
                                    'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
                                )}
                            >
                                <Header fixed>
                                    <TopNav links={topNavData} />
                                    <div className='ml-auto flex items-center space-x-4'>
                                        <ThemeSwitch />
                                        <LanguageSwitcher currentLocale={locale} />
                                    </div>
                                </Header>
                                {children}
                            </div>
                            {/* </SearchProvider> */}
                        </SidebarProvider>
                    </div>
                </ThemeProvider>
            </div>
        </AppProvider>
    );
}
import Image from "next/image";
import { getLocale, getTranslations } from "@/lib/i18n";
import { getAuthSession } from "@/lib/auth/session";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations(locale);
  const session = await getAuthSession();

  console.log("Session data:", session);

  // Get language name for display
  const languageNames = {
    'en': 'English',
    'zh-CN': '中文 (简体)',
    'zh-TW': '中文 (繁體)'
  };
  const displayLanguage = languageNames[locale as keyof typeof languageNames] || locale;

  // Format user roles for display
  const userRoles = session.userRole?.length > 0
    ? session.userRole.join(', ')
    : 'No roles assigned';

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1>{t.greeting} {session.userName || 'Guess'}</h1>
          <p>{t.welcome}</p>
          <p className="text-sm mt-4 text-gray-500">
            {t.currentLanguage || 'Current language'}: {displayLanguage}
          </p>
          {session.isLoggedIn && (
            <>
              <div className="mt-4 p-4 border border-gray-700 rounded-md bg-gray-800">
                <p className="font-medium text-gray-200">AuthSessionData</p>
                <p className="text-sm mt-1 text-gray-300">User ID: {session.userId}</p>
                <p className="text-sm mt-1 text-gray-300">Name: {session.userName}</p>
                <p className="text-sm mt-1 text-gray-300">Roles: {userRoles}</p>
                <p className="text-sm mt-1 text-gray-300">FirstName: {session.firstName}</p>
                <p className="text-sm mt-1 text-gray-300">LastName: {session.lastName}</p>
                <p className="text-sm mt-1 text-gray-300">Email: {session.email}</p>
                <p className="text-sm mt-1 text-gray-300">AccessToken: {session.accessToken}</p>

              </div>

              {/* <div className="mt-4 p-4 border rounded-md bg-gray-50">
                <p className="font-medium">Current Login Information</p>
                <p className="text-sm mt-1">User ID: {session.currentLoginInformations?.user.emailAddress}</p>
              </div> */}
            </>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

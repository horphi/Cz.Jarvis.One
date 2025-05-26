import { cookies, headers } from "next/headers";

import { supportedLocales } from '@/lib/supportedLanguage';
const defaultLocale = "en";

// Remove the hardcoded translations object
// export const translations = { ... };

// Function to load translations dynamically
export const getTranslations = async (locale: string) => {
  try {
    // Dynamically import the JSON file for the given locale
    const translations = await import(`./locales/${locale}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Could not load translations for locale: ${locale}`, error);
    // Fallback to default locale if the requested locale is not found
    const translations = await import(`./locales/${defaultLocale}.json`);
    return translations.default;
  }
};

export const getLocale = async (): Promise<string> => {
  // 1. Check for the language cookie
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("NEXT_LOCALE");
  const cookieLocale = cookieHeader?.value;

  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Improved Accept-Language header handling
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  if (acceptLanguage) {
    // Parse the Accept-Language header properly
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, priority] = lang.trim().split(";q=");
        return {
          code: code.trim(),
          priority: priority ? parseFloat(priority) : 1.0,
        };
      })
      .sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)

    // Check for exact matches first
    for (const lang of languages) {
      if (supportedLocales.includes(lang.code)) {
        return lang.code;
      }
    }

    // Then check for language matches (e.g., 'en-US' should match with 'en')
    for (const lang of languages) {
      const baseLang = lang.code.split("-")[0];
      const match = supportedLocales.find(
        (locale) => locale === baseLang || locale.startsWith(`${baseLang}-`)
      );
      if (match) return match;
    }
  }

  // 3. Fallback to default locale
  return defaultLocale;
};

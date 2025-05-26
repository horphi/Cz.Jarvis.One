import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "@/lib/i18n";
import { ToasterProvider } from "@/components/ui/toaster-provider"

// Only disable TLS certificate validation in development environment
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const metadata: Metadata = {
  title: "Cz Jarvis App",
  description: "Dashboard for Cz Jarvis",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="group/body">
        <div id="root">
          {children}
        </div>
        <ToasterProvider />
      </body>
    </html>
  );
}

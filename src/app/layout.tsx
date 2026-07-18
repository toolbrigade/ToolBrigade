import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    default: "ToolBrigade — Free Online Tools for Developers & Creators",
    template: "%s | ToolBrigade",
  },
  description:
    "ToolBrigade offers free browser-based tools for text, images, PDFs, code, and conversions. No sign-up, no uploads, instant results.",
  keywords: [
    "free online tools",
    "developer tools",
    "image tools",
    "PDF tools",
    "text tools",
    "code tools",
    "converter",
    "toolbrigade",
  ],
  authors: [{ name: "EpexLogics", url: "https://epexlogics.com" }],
  creator: "EpexLogics",
  publisher: "EpexLogics",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "ToolBrigade",
    title: "ToolBrigade — Free Online Tools for Developers & Creators",
    description:
      "Free browser-based tools for text, images, PDFs, code, and conversions. No sign-up required.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToolBrigade" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@toolbrigade",
    title: "ToolBrigade — Free Online Tools",
    description: "Free browser-based tools. No sign-up, no uploads, instant results.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=document.cookie.match(/(?:^|;\\s*)theme=([^;]*)/);var t=c?c[1]:null;var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&p))document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen`}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}</Script>
          </>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

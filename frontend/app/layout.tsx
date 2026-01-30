import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Providers from "./providers";
import SnowEffect from "../components/SnowEffect";
import { ThemeProvider, ThemeToggle } from "../components/ThemeProvider";

import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  metadataBase: new URL("https://startupspace.uz"),
  title: {
    default: "Startup Space | Turn Your Ideas into Reality",
    template: "%s | Startup Space",
  },
  description:
    "Startup Space is Uzbekistan's premier platform for sharing startup ideas, finding co-founders, and connecting with investors. Join the community today.",
  keywords: [
    "startup",
    "uzbekistan",
    "ideas",
    "investment",
    "business",
    "innovation",
    "technology",
    "entrepreneurship",
    "crowdsourcing",
    "funding",
  ],
  openGraph: {
    title: "Startup Space | Turn Your Ideas into Reality",
    description:
      "Share your startup ideas, get feedback, and find the resources you need to succeed.",
    url: "https://startupspace.uz",
    siteName: "Startup Space",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Space",
    description: "The platform for startup ideas in Uzbekistan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="font-[var(--font-space)]">
        <Providers>
          <ThemeProvider>
            <div className="min-h-screen">
              <Header />
              <main className="mx-auto max-w-6xl px-6 pb-16 pt-8 fade-in">
                {children}
              </main>
            </div>
            <ThemeToggle />
            <SnowEffect />
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
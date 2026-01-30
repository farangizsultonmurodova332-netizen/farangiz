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
    "tashkent startups",
    "central asia business",
  ],
  authors: [{ name: "Startup Space Team" }],
  creator: "Startup Space",
  publisher: "Startup Space",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Startup Space | Turn Your Ideas into Reality",
    description:
      "Share your startup ideas, get feedback, and find the resources you need to succeed in Uzbekistan's growing startup ecosystem.",
    url: "https://startupspace.uz",
    siteName: "Startup Space",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Ensure this image exists or is handled
        width: 1200,
        height: 630,
        alt: "Startup Space Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Space",
    description: "The platform for startup ideas in Uzbekistan.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Placeholder, user needs to provide actual code if they have it
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Startup Space",
    url: "https://startupspace.uz",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://startupspace.uz/?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="font-[var(--font-space)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <div className="min-h-screen">
            <Header />
            <main className="mx-auto max-w-6xl px-6 pb-16 pt-8 fade-in">
              {children}
            </main>
          </div>
          <SnowEffect />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
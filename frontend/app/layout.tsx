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
  title: "Crowdsourced Idea Bank",
  description: "Post ideas, vote, and discuss with the community.",
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
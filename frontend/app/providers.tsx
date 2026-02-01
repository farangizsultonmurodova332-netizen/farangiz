"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "../lib/auth";
import { LanguageProvider } from "../lib/i18n";
import { CallProvider } from "../context/CallContext";
import CallModal from "../components/CallModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CallProvider>
            <CallModal />
            {children}
          </CallProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

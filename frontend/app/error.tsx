"use client";

import { useEffect } from "react";
import { useLanguage } from "../lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card p-8 md:p-12 max-w-lg w-full text-center">
        <div className="text-6xl mb-4">!</div>
        <h1 className="text-2xl font-bold text-ink mb-3">{t("error.title")}</h1>
        <p className="text-ink/70 mb-6">{t("error.body")}</p>
        {error.digest && (
          <p className="text-xs text-ink/50 mb-4">
            {t("error.id")}: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            {t("error.tryAgain")}
          </button>
          <a href="/" className="btn-secondary">
            {t("error.goHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

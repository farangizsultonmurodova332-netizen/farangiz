"use client";

import Link from "next/link";
import { useLanguage } from "../lib/i18n";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card p-8 md:p-12 max-w-lg w-full text-center">
        <div className="text-6xl font-bold text-ink/20 mb-4">404</div>
        <h1 className="text-2xl font-bold text-ink mb-3">{t("notFound.title")}</h1>
        <p className="text-ink/70 mb-6">{t("notFound.body")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            {t("notFound.goHome")}
          </Link>
          <Link href="/ideas/new" className="btn-secondary">
            {t("notFound.shareIdea")}
          </Link>
        </div>
      </div>
    </div>
  );
}

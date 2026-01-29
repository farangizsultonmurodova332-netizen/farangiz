"use client";

import { useLanguage } from "../lib/i18n";

export default function Loading({ label }: { label?: string }) {
  const { t } = useLanguage();
  const text = label || t("common.loading");

  return (
    <div className="space-y-3">
      <div className="text-sm text-ink/60">{text}</div>
      <div className="grid gap-3">
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import EmptyState from "../../components/EmptyState";
import { useLanguage } from "../../lib/i18n";

export default function LogoutPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  if (!user) {
    return (
      <EmptyState
        title={t("logout.signedOutTitle")}
        description={t("logout.signedOutBody")}
        actionLabel={t("nav.signIn")}
        actionHref="/login"
      />
    );
  }

  const handleConfirm = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center p-6">
      <div className="card w-full max-w-lg p-8 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            {t("profile.account")}
          </p>
          <h1 className="text-2xl font-semibold text-ink">{t("logout.title")}</h1>
        </div>
        <p className="text-sm text-ink/60">{t("logout.confirm")}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={handleConfirm}>
            {t("logout.confirmButton")}
          </button>
          <Link href="/profile" className="btn-secondary">
            {t("logout.cancel")}
          </Link>
        </div>
      </div>
    </div>
  );
}

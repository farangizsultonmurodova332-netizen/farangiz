"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";
import { useLanguage } from "../../../lib/i18n";
import type { User } from "../../../lib/types";
import EmptyState from "../../../components/EmptyState";
import Loading from "../../../components/Loading";

export default function EditProfilePage() {
  const { user, apiFetch } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    bio: "",
    avatar_url: "",
    birth_date: "",
    phone: "",
    portfolio_url: "",
    location: "",
  });
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);

  const profileQuery = useQuery({
    queryKey: ["me-profile"],
    queryFn: () => apiFetch<User>("/users/me"),
    enabled: !!user,
    refetchOnMount: "always",
    staleTime: 0,
  });

  useEffect(() => {
    if (!user || !profileQuery.data) return;
    setFormError(null);
    setFormState({
      username: profileQuery.data.username ?? user.username,
      email: profileQuery.data.email ?? user.email,
      bio: profileQuery.data.bio ?? user.bio ?? "",
      avatar_url: profileQuery.data.avatar_url ?? "",
      birth_date: profileQuery.data.birth_date ?? "",
      phone: profileQuery.data.phone ?? "",
      portfolio_url: profileQuery.data.portfolio_url ?? "",
      location: profileQuery.data.location ?? "",
    });
    setPortfolioFile(null);
  }, [profileQuery.data, user]);

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    setFormError(null);
    try {
      const data = new FormData();
      data.append("avatar", file);
      const response = await apiFetch<{ avatar_url: string }>("/users/me/avatar", {
        method: "POST",
        body: data,
      });
      setFormState((prev) => ({ ...prev, avatar_url: response.avatar_url }));
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);
    try {
      if (portfolioFile) {
        const data = new FormData();
        data.append("username", formState.username.trim());
        data.append("email", formState.email.trim());
        data.append("bio", formState.bio.trim());
        data.append("avatar_url", formState.avatar_url.trim());
        data.append("birth_date", formState.birth_date);
        data.append("phone", formState.phone.trim());
        data.append("location", formState.location.trim());
        data.append("portfolio_file", portfolioFile);
        const timestamp = Date.now();
        await apiFetch<User>(`/users/me?t=${timestamp}`, {
          method: "PATCH",
          body: data,
        });
      } else {
        const payload: Record<string, string> = {
          username: formState.username.trim(),
          email: formState.email.trim(),
          bio: formState.bio.trim(),
          avatar_url: formState.avatar_url.trim(),
          birth_date: formState.birth_date,
          phone: formState.phone.trim(),
          location: formState.location.trim(),
        };
        const timestamp = Date.now();
        await apiFetch<User>(`/users/me?t=${timestamp}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      }
      router.push("/profile");
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <EmptyState
        title={t("profile.signInEditTitle")}
        description={t("profile.signInEditBody")}
        actionLabel={t("nav.signIn")}
        actionHref="/login"
      />
    );
  }

  if (profileQuery.isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            {t("profile.account")}
          </p>
          <h1 className="text-2xl font-semibold text-ink">{t("profile.editProfile")}</h1>
        </div>
        <Link href="/profile" className="btn-secondary">
          {t("profile.backToProfile")}
        </Link>
      </div>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form className="space-y-4" onSubmit={handleEditSubmit}>
            <div>
              <label className="text-sm font-medium text-ink">{t("auth.username")}</label>
              <input
                className="input mt-2"
                value={formState.username}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, username: event.target.value }))
                }
                placeholder={t("auth.username")}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("auth.email")}</label>
              <input
                type="email"
                className="input mt-2"
                value={formState.email}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder={t("auth.email")}
                required
              />
              <p className="mt-2 text-xs text-ink/60">
                {t("profile.currentEmail")}: {profileQuery.data?.email ?? user.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("profile.birthDate")}</label>
              <input
                type="date"
                className="input mt-2"
                value={formState.birth_date}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, birth_date: event.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("profile.phone")}</label>
              <input
                type="tel"
                className="input mt-2"
                value={formState.phone}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, phone: event.target.value }))
                }
                placeholder={t("profile.phonePlaceholder")}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("profile.portfolio")}</label>
              <input
                className="input mt-2"
                type="file"
                accept=".pdf,.doc,.docx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
                onChange={(event) => setPortfolioFile(event.target.files?.[0] ?? null)}
              />
              <p className="mt-2 text-xs text-ink/60">{t("profile.portfolioHint")}</p>
              {formState.portfolio_url && (
                <p className="mt-2 text-xs text-ink/70">
                  <a className="underline" href={formState.portfolio_url} target="_blank" rel="noreferrer">
                    {t("profile.portfolioCurrent")}
                  </a>
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("profile.location")}</label>
              <input
                className="input mt-2"
                value={formState.location}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, location: event.target.value }))
                }
                placeholder={t("profile.locationPlaceholder")}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("profile.avatarImage")}</label>
              <input
                type="file"
                accept="image/*"
                className="input mt-2"
                onChange={(event) => handleAvatarUpload(event.target.files?.[0] ?? null)}
              />
              <p className="mt-2 text-xs text-ink/60">
                {t("profile.uploadHint")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("profile.bio")}</label>
              <textarea
                className="input mt-2 min-h-[96px]"
                value={formState.bio}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, bio: event.target.value }))
                }
                placeholder={t("profile.bioPlaceholder")}
              />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex flex-wrap justify-end gap-2">
              <Link href="/profile" className="btn-secondary">
                {t("profile.cancel")}
              </Link>
              <button type="submit" className="btn-primary" disabled={isSaving || isUploading}>
                {isSaving ? t("profile.saving") : t("profile.saveChanges")}
              </button>
            </div>
          </form>
          <aside className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              {t("profile.livePreview")}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-lg font-semibold text-ink/60">
                {formState.avatar_url ? (
                  <img
                    src={formState.avatar_url}
                    alt={t("profile.avatarImage")}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (formState.username || user.username).charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-ink">
                  {formState.username || user.username}
                </p>
                <p className="text-xs text-ink/60">{formState.email || user.email}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-white/70 bg-white/70 px-3 py-3 text-sm text-ink/70">
              <p className="font-semibold text-ink">{t("profile.bio")}</p>
              <p className="mt-1">
                {formState.bio || t("profile.bioPreviewPlaceholder")}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

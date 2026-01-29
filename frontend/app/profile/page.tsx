"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/auth";
import type { Idea, PaginatedResponse, User } from "../../lib/types";
import IdeaCard from "../../components/IdeaCard";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import { useLanguage } from "../../lib/i18n";

export default function ProfilePage() {
  const { user, apiFetch } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const profileQuery = useQuery({
    queryKey: ["me-profile"],
    queryFn: () => apiFetch<User>("/users/me"),
    enabled: !!user,
    refetchOnMount: "always", // Always refetch when component mounts
    staleTime: 0, // Always fetch fresh data
  });

  const ideasQuery = useQuery({
    queryKey: ["my-ideas", user?.id],
    queryFn: () => apiFetch<PaginatedResponse<Idea>>(`/ideas?author=${user?.id}`),
    enabled: !!user,
  });

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen]);

  if (!user) {
    return (
      <EmptyState
        title={t("profile.signInViewTitle")}
        description={t("profile.signInViewBody")}
        actionLabel={t("nav.signIn")}
        actionHref="/login"
      />
    );
  }

  const ideas = ideasQuery.data?.results || [];
  const profile = profileQuery.data;
  const displayName = profile?.username ?? user.username;
  const profileEmail = profile?.email ?? user.email;
  const profileBio = profile?.bio ?? user.bio ?? "";
  const profileAvatar = profile?.avatar_url ?? "";
  const profilePhone = profile?.phone ?? "";


  return (
    <div className="space-y-8">
      <section className="relative overflow-visible rounded-3xl border border-white/70 bg-gradient-to-br from-white via-slate-50 to-teal-50 p-6 shadow-soft">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-col items-center gap-4 lg:w-64">
            <div className="group relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-3xl font-semibold text-ink/60 ring-4 ring-white">
                {profileAvatar ? (
                  <img
                    src={profileAvatar}
                    alt={`${displayName} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <Link
                href="/profile/edit"
                className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink/70 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                aria-label={t("profile.editAvatar")}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M4 7h3l2-2h6l2 2h3v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-semibold text-ink">{displayName}</h1>
                <p className="text-sm text-ink/60">{profileEmail}</p>
                {profilePhone && <p className="text-sm text-ink/60">{profilePhone}</p>}
                <p className="text-sm text-ink/70">
                  {profileBio
                    ? profileBio.split("\n")[0].slice(0, 60)
                    : t("profile.taglineFallback")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    className="btn-ghost rounded-full p-2"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    aria-label={t("profile.profileActions")}
                    aria-expanded={isMenuOpen}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <circle cx="5" cy="12" r="2" fill="currentColor" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                      <circle cx="19" cy="12" r="2" fill="currentColor" />
                    </svg>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-white/60 bg-white/90 p-2 shadow-lg backdrop-blur">
                      <Link
                        href="/profile/edit"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("profile.editProfile")}
                      </Link>
                      <Link
                        href="/profile/password"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("profile.changePassword")}
                      </Link>
                      <Link
                        href="/profile/devices"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("profile.devices")}
                      </Link>
                      <Link
                        href="/logout"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("profile.signOut")}
                      </Link>
                      <Link
                        href="/profile/groups/new"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("profile.createGroup")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-transparent px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {t("profile.ideasLabel")}
                </p>
                <p className="text-2xl font-semibold text-ink">
                  {profile?.total_ideas ?? ideas.length}
                </p>
              </div>
              <Link
                href="/profile/followers"
                className="rounded-2xl bg-transparent px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {t("profile.followers")}
                </p>
                <p className="text-2xl font-semibold text-ink">{profile?.followers_count ?? 0}</p>
              </Link>
              <Link
                href="/profile/following"
                className="rounded-2xl bg-transparent px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {t("profile.following")}
                </p>
                <p className="text-2xl font-semibold text-ink">{profile?.following_count ?? 0}</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-ink">{t("profile.myIdeas")}</h2>
            <p className="text-sm text-ink/60">{t("profile.keepBuilding")}</p>
          </div>
          <a href="/ideas/new" className="btn-secondary">
            {t("profile.startIdea")}
          </a>
        </div>
        {ideasQuery.isLoading && <Loading />}
        {ideasQuery.error && (
          <EmptyState
            title={t("profile.ideasUnavailableTitle")}
            description={(ideasQuery.error as Error).message || t("profile.ideasUnavailableBody")}
          />
        )}
        {ideasQuery.data?.results?.length === 0 && (
          <EmptyState
            title={t("profile.noIdeasTitle")}
            description={t("profile.noIdeasBody")}
            actionLabel={t("profile.createIdea")}
            actionHref="/ideas/new"
          />
        )}
        <div className="grid gap-4">
          {ideasQuery.data?.results?.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>
    </div>
  );
}

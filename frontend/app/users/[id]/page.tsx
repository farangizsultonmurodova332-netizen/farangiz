"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth";
import type { Idea, PaginatedResponse, User } from "../../../lib/types";
import IdeaCard from "../../../components/IdeaCard";
import EmptyState from "../../../components/EmptyState";
import Loading from "../../../components/Loading";
import ChatButton from "../../../components/ChatButton";
import { useLanguage } from "../../../lib/i18n";

export default function UserProfilePage() {
  const params = useParams();
  const userId = Number(params.id);
  const { user: currentUser, apiFetch } = useAuth();
  const { t } = useLanguage();

  const profileQuery = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => apiFetch<User>(`/users/${userId}`),
  });

  const ideasQuery = useQuery({
    queryKey: ["user-ideas", userId],
    queryFn: () => apiFetch<PaginatedResponse<Idea>>(`/ideas?author=${userId}`),
  });


  if (profileQuery.isLoading) return <Loading />;
  if (profileQuery.error) {
    return (
      <EmptyState
        title={t("profile.userNotFoundTitle")}
        description={t("profile.userNotFoundRemovedBody")}
        actionLabel={t("common.backHome")}
        actionHref="/"
      />
    );
  }

  const profile = profileQuery.data;

  if (!profile) {
    return (
      <EmptyState
        title={t("profile.userNotFoundTitle")}
        description={t("profile.userNotFoundBody")}
        actionLabel={t("common.backHome")}
        actionHref="/"
      />
    );
  }

  const ideas = ideasQuery.data?.results || [];
  const isOwnProfile = currentUser?.id === userId;
  const displayName = profile.username;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-slate-50 to-teal-50 p-6 shadow-soft">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-col items-center gap-4 lg:w-64">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-3xl font-semibold text-ink/60 ring-4 ring-white">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${displayName} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
          </div>
          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-semibold text-ink">{displayName}</h1>
                <p className="text-sm text-ink/70">
                  {profile.bio
                    ? profile.bio.split("\n")[0].slice(0, 60)
                    : t("profile.taglineFallback")}
                </p>
              </div>
              {!isOwnProfile && currentUser && (
                <ChatButton
                  userId={profile.id}
                  username={profile.username}
                  className="btn-primary"
                />
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-transparent px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {t("profile.ideasLabel")}
                </p>
                <p className="text-2xl font-semibold text-ink">{profile.total_ideas ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-transparent px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {t("profile.followers")}
                </p>
                <p className="text-2xl font-semibold text-ink">{profile.followers_count ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-transparent px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {t("profile.following")}
                </p>
                <p className="text-2xl font-semibold text-ink">{profile.following_count ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Portfolio Section */}
      {(profile.location || profile.portfolio_url) && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {profile.location && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{profile.location}</span>
              </div>
            )}
            {profile.portfolio_url && (
              <a
                href={profile.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                {t("profile.viewPortfolio") || "View Portfolio / CV"}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </a>
            )}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-ink">
          {t("profile.ideasBy", { username: profile.username, count: ideas.length })}
        </h2>
        {ideasQuery.isLoading && <Loading />}
        {ideas.length === 0 && !ideasQuery.isLoading ? (
          <EmptyState
            title={t("profile.noIdeasTitle")}
            description={t("profile.noUserIdeasBody", { username: profile.username })}
          />
        ) : (
          <div className="grid gap-4">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

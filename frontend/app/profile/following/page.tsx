"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";
import type { User } from "../../../lib/types";
import EmptyState from "../../../components/EmptyState";
import Loading from "../../../components/Loading";
import { useLanguage } from "../../../lib/i18n";

export default function FollowingPage() {
  const { user, apiFetch } = useAuth();
  const { t } = useLanguage();

  const followingQuery = useQuery({
    queryKey: ["profile-following", user?.id],
    queryFn: () => apiFetch<User[]>(`/users/${user?.id}/following`),
    enabled: !!user,
  });

  if (!user) {
    return (
      <EmptyState
        title={t("connections.signInFollowing")}
        description={t("connections.signInFollowingBody")}
        actionLabel={t("nav.signIn")}
        actionHref="/login"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            {t("connections.title")}
          </p>
          <h1 className="text-2xl font-semibold text-ink">{t("connections.followingTitle")}</h1>
        </div>
        <Link href="/profile" className="btn-secondary">
          {t("profile.backToProfile")}
        </Link>
      </div>

      {followingQuery.isLoading && <Loading />}
      {followingQuery.error && (
        <EmptyState
          title={t("connections.followingUnavailable")}
          description={(followingQuery.error as Error).message}
        />
      )}
      {followingQuery.data && followingQuery.data.length === 0 && (
        <EmptyState
          title={t("connections.followingEmptyTitle")}
          description={t("connections.followingEmptyBody")}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {followingQuery.data?.map((followedUser) => (
          <Link
            key={followedUser.id}
            href={`/users/${followedUser.id}`}
            className="card p-4 flex items-center gap-4"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-lg font-semibold text-ink/60">
              {followedUser.avatar_url ? (
                <img
                  src={followedUser.avatar_url}
                  alt={`${followedUser.username} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                followedUser.username.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="font-semibold text-ink">{followedUser.username}</p>
              {followedUser.bio && <p className="text-sm text-ink/60">{followedUser.bio}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

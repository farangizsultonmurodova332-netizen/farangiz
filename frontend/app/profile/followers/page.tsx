"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";
import type { User } from "../../../lib/types";
import EmptyState from "../../../components/EmptyState";
import Loading from "../../../components/Loading";
import { useLanguage } from "../../../lib/i18n";

export default function FollowersPage() {
  const { user, apiFetch } = useAuth();
  const { t } = useLanguage();

  const followersQuery = useQuery({
    queryKey: ["profile-followers", user?.id],
    queryFn: () => apiFetch<User[]>(`/users/${user?.id}/followers`),
    enabled: !!user,
  });

  if (!user) {
    return (
      <EmptyState
        title={t("connections.signInFollowers")}
        description={t("connections.signInFollowersBody")}
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
          <h1 className="text-2xl font-semibold text-ink">{t("connections.followersTitle")}</h1>
        </div>
        <Link href="/profile" className="btn-secondary">
          {t("profile.backToProfile")}
        </Link>
      </div>

      {followersQuery.isLoading && <Loading />}
      {followersQuery.error && (
        <EmptyState
          title={t("connections.followersUnavailable")}
          description={(followersQuery.error as Error).message}
        />
      )}
      {followersQuery.data && followersQuery.data.length === 0 && (
        <EmptyState
          title={t("connections.followersEmptyTitle")}
          description={t("connections.followersEmptyBody")}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {followersQuery.data?.map((follower) => (
          <Link
            key={follower.id}
            href={`/users/${follower.id}`}
            className="card p-4 flex items-center gap-4"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-haze text-lg font-semibold text-ink-muted">
              {follower.avatar_url ? (
                <img
                  src={follower.avatar_url}
                  alt={`${follower.username} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                follower.username.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="font-semibold text-ink">{follower.username}</p>
              {follower.bio && <p className="text-sm text-ink/60">{follower.bio}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

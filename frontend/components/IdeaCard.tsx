"use client";

import Link from "next/link";
import type { Idea } from "../lib/types";
import { timeAgo } from "../lib/format";
import TagPill from "./TagPill";
import { useLanguage } from "../lib/i18n";

export default function IdeaCard({ idea }: { idea: Idea }) {
  const { t } = useLanguage();

  return (
    <div className="card card-hover p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink/60">
        <span className="pill bg-haze text-ink/70">{idea.category}</span>
        {idea.tags.slice(0, 3).map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
        {idea.tags.length > 3 && <span className="text-xs text-ink/40">+{idea.tags.length - 3}</span>}
        {idea.comment_count < 2 && (
          <span className="pill bg-amber-100 text-amber-700">{t("idea.needsFeedback")}</span>
        )}
        {idea.comment_count >= 5 && (
          <span className="pill bg-emerald-100 text-emerald-700">{t("idea.activeDiscussion")}</span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <Link href={`/ideas/${idea.id}`} className="text-xl font-semibold text-ink">
            {idea.title}
          </Link>
          <p className="mt-2 text-sm text-ink/70">{idea.short_description}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ink/60">
        <div className="text-ink/50">
          {t("common.by")}{" "}
          <Link href={`/users/${idea.author.id}`} className="hover:text-teal hover:underline">
            {idea.author.username}
          </Link>{" "}
          - {timeAgo(idea.created_at)}
        </div>
        <div className="flex items-center gap-3">
          {idea.like_count > 0 && (
            <div className="flex items-center gap-1">
              <span>{t("idea.likes")}</span>
              <span>{idea.like_count}</span>
            </div>
          )}
          {idea.comment_count > 0 && (
            <div className="flex items-center gap-1">
              <span>{t("idea.comments")}</span>
              <span>{idea.comment_count}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Loading from "../../../components/Loading";
import EmptyState from "../../../components/EmptyState";
import TagPill from "../../../components/TagPill";
import { useAuth } from "../../../lib/auth";
import { useLanguage } from "../../../lib/i18n";
import type { Comment, Idea, PaginatedResponse } from "../../../lib/types";
import { timeAgo } from "../../../lib/format";
import IdeaCommentsDrawer from "../../../components/IdeaCommentsDrawer";

export default function IdeaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ideaId = Number(params.id);
  const { apiFetch, user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    title: "",
    short_description: "",
    full_description: "",
    category: "",
    tags: "",
  });

  const ideaQuery = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: () => apiFetch<Idea>(`/ideas/${ideaId}`),
  });

  const commentsQuery = useQuery({
    queryKey: ["comments", ideaId],
    queryFn: () => apiFetch<Comment[] | PaginatedResponse<Comment>>(`/ideas/${ideaId}/comments`),
  });

  const likeMutation = useMutation({
    mutationFn: () => apiFetch(`/ideas/${ideaId}/like`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/ideas/${ideaId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editValues.title,
          short_description: editValues.short_description,
          full_description: editValues.full_description,
          category: editValues.category,
          tags: editValues.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiFetch(`/ideas/${ideaId}`, { method: "DELETE" }),
    onSuccess: () => router.push("/"),
  });

  const followMutation = useMutation({
    mutationFn: (authorId: number) => apiFetch(`/users/${authorId}/follow`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["idea", ideaId] }),
  });

  if (ideaQuery.isLoading) return <Loading />;
  if (ideaQuery.error) {
    return (
      <EmptyState
        title={t("ideas.notAvailable")}
        description={(ideaQuery.error as Error).message}
        actionLabel={t("ideas.backToIdeas")}
        actionHref="/"
      />
    );
  }

  const idea = ideaQuery.data;

  if (!idea) {
    return (
      <EmptyState
        title={t("ideas.notFound")}
        description={t("ideas.notFoundBody")}
        actionLabel={t("ideas.backToIdeas")}
        actionHref="/"
      />
    );
  }

  const startEdit = () => {
    setEditValues({
      title: idea.title,
      short_description: idea.short_description,
      full_description: idea.full_description,
      category: idea.category,
      tags: idea.tags.join(", "),
    });
    setIsEditing(true);
  };

  const commentsData = commentsQuery.data;
  const commentsList = Array.isArray(commentsData) ? commentsData : commentsData?.results || [];

  return (
    <div className="space-y-8">
      <section className="relative lg:flex lg:items-start lg:gap-6">
        <div className="card p-8 lg:flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <input
                value={editValues.title}
                onChange={(event) => setEditValues({ ...editValues, title: event.target.value })}
                className="input"
              />
              <input
                value={editValues.short_description}
                onChange={(event) => setEditValues({ ...editValues, short_description: event.target.value })}
                className="input"
                placeholder={t("ideas.shortDescription")}
              />
              <textarea
                value={editValues.full_description}
                onChange={(event) => setEditValues({ ...editValues, full_description: event.target.value })}
                className="input min-h-[140px]"
              />
              <input
                value={editValues.category}
                onChange={(event) => setEditValues({ ...editValues, category: event.target.value })}
                className="input"
              />
              <input
                value={editValues.tags}
                onChange={(event) => setEditValues({ ...editValues, tags: event.target.value })}
                className="input"
              />
              <div className="flex gap-3">
                <button className="btn-primary" onClick={() => updateMutation.mutate()}>
                  {t("common.saveChanges")}
                </button>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink/60">
                <span className="pill bg-haze text-ink/70">{idea.category}</span>
                {idea.tags.map((tag) => (
                  <TagPill key={tag} label={tag} />
                ))}
                <span className="text-ink/50">
                  {t("common.by")}{" "}
                  <Link href={`/users/${idea.author.id}`} className="hover:text-teal hover:underline">
                    {idea.author.username}
                  </Link>
                </span>
                <span className="text-ink/40">{timeAgo(idea.created_at)}</span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-ink">{idea.title}</h1>
              <p className="mt-3 text-ink/70">{idea.full_description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {user ? (
                  <button
                    onClick={() => likeMutation.mutate()}
                    className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      idea.user_liked ? "text-rose-600" : "text-ink/60 hover:text-rose-600"
                    }`}
                    aria-label={t("ideas.like")}
                  >
                    <Heart size={22} className={idea.user_liked ? "fill-current" : ""} />
                    {idea.like_count > 0 && <span>{idea.like_count}</span>}
                  </button>
                ) : (
                  <a
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/40"
                  >
                    <Heart size={22} />
                    {idea.like_count > 0 && <span>{idea.like_count}</span>}
                  </a>
                )}

                {/* Follow button - only for other users */}
                {user && user.id !== idea.author.id && (
                  <button
                    className={`btn ${idea.author.is_following ? "bg-ink text-white" : "btn-secondary"}`}
                    onClick={() => followMutation.mutate(idea.author.id)}
                  >
                    {idea.author.is_following ? t("ideas.following") : t("ideas.follow")}
                  </button>
                )}

                {/* Comments button - available to all signed-in users */}
                {user && (
                  <button
                    onClick={() => setIsCommentsDrawerOpen(true)}
                    className="btn-secondary"
                  >
                    {t("idea.comments")} ({idea.comment_count})
                  </button>
                )}

                {/* Edit/Delete buttons - only for author */}
                {user?.id === idea.author.id && (
                  <div className="ml-auto flex gap-2">
                    <button className="btn-secondary" onClick={startEdit}>
                      {t("common.edit")}
                    </button>
                    <button className="btn bg-red-600 text-white" onClick={() => deleteMutation.mutate()}>
                      {t("common.delete")}
                    </button>
                  </div>
                )}

                {!user && (
                  <span className="text-xs text-ink/50">{t("ideas.signInToInteract")}</span>
                )}
              </div>
            </>
          )}
        </div>
        {isCommentsDrawerOpen && (
          <div className="mt-6 lg:mt-0 lg:flex-none">
            <IdeaCommentsDrawer
              isOpen={isCommentsDrawerOpen}
              onClose={() => setIsCommentsDrawerOpen(false)}
              ideaId={ideaId}
              ideaAuthorId={idea.author.id}
              ideaTitle={idea.title}
              comments={commentsList}
              isLoading={commentsQuery.isLoading}
            />
          </div>
        )}
      </section>
    </div>
  );
}

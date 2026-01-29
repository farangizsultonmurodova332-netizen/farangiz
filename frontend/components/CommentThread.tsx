"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Pin } from "lucide-react";
import type { Comment } from "../lib/types";
import { timeAgo } from "../lib/format";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/i18n";

export default function CommentThread({
  comments,
  onReply,
  ideaId,
  ideaAuthorId,
}: {
  comments: Comment[];
  onReply: (parentId: number) => void;
  ideaId: number;
  ideaAuthorId?: number;
}) {
  const { apiFetch, user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  const likeMutation = useMutation({
    mutationFn: (commentId: number) => apiFetch(`/comments/${commentId}/like`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
    },
  });

  const pinMutation = useMutation({
    mutationFn: (commentId: number) => apiFetch(`/comments/${commentId}/pin`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ commentId, body }: { commentId: number; body: string }) =>
      apiFetch(`/comments/${commentId}/edit`, {
        method: "PATCH",
        body: JSON.stringify({ body }),
      }),
    onSuccess: () => {
      setEditingId(null);
      setEditBody("");
      queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => apiFetch(`/comments/${commentId}/delete`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
  });

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditBody(comment.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBody("");
  };

  const topLevel = comments.filter((comment) => !comment.parent);
  const replies = comments.filter((comment) => comment.parent);

  const repliesByParent = replies.reduce<Record<number, Comment[]>>((acc, reply) => {
    const parentId = reply.parent as number;
    acc[parentId] = acc[parentId] || [];
    acc[parentId].push(reply);
    return acc;
  }, {});
  Object.keys(repliesByParent).forEach((key) => {
    repliesByParent[Number(key)] = repliesByParent[Number(key)]
      .slice()
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  });

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "pl-10 py-2" : "py-2"}`}>
      {editingId === comment.id ? (
        <div className="space-y-2">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className="input min-h-[80px] w-full"
          />
          <div className="flex gap-2">
            <button
              onClick={() => editMutation.mutate({ commentId: comment.id, body: editBody })}
              className="btn-primary text-xs"
              disabled={!editBody.trim()}
            >
              {t("comments.save")}
            </button>
            <button onClick={cancelEdit} className="btn-ghost text-xs">
              {t("common.cancel")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm text-ink/80">{comment.body}</div>
          <div className="mt-2 flex items-center justify-between text-xs text-ink/50">
            <span className="flex items-center gap-2">
              <span className="font-medium text-ink/80">{comment.author.username}</span>
              <span>{timeAgo(comment.created_at)}</span>
            </span>
            <div className="flex items-start gap-2">
              {(comment.is_pinned || (user && ideaAuthorId && user.id === ideaAuthorId)) && (
                <button
                  onClick={() => {
                    if (user && ideaAuthorId && user.id === ideaAuthorId) {
                      pinMutation.mutate(comment.id);
                    }
                  }}
                  aria-label={comment.is_pinned ? t("comments.unpin") : t("comments.pin")}
                  className={`inline-flex items-center justify-center px-1 py-1 ${
                    comment.is_pinned ? "text-teal" : "text-ink/50"
                  } ${user && ideaAuthorId && user.id === ideaAuthorId ? "" : "cursor-default"}`}
                >
                  <Pin className={`h-3 w-3 -rotate-45 ${comment.is_pinned ? "fill-current" : ""}`} />
                </button>
              )}
              {user ? (
                <button
                  onClick={() => likeMutation.mutate(comment.id)}
                  className={`flex items-center gap-1 ${comment.user_liked ? "text-teal" : "text-ink/50"} hover:text-teal`}
                >
                  <Heart className="h-4 w-4" fill={comment.user_liked ? "currentColor" : "none"} />
                  {comment.like_count ? comment.like_count : null}
                </button>
              ) : (
                <span className="flex items-center gap-1 text-ink/40">
                  <Heart className="h-4 w-4" />
                  {comment.like_count ? comment.like_count : null}
                </span>
              )}
              <button onClick={() => onReply(comment.parent ?? comment.id)} className="btn-ghost text-xs">
                {t("comments.reply")}
              </button>
              {user?.id === comment.author.id && (
                <>
                  <button onClick={() => startEdit(comment)} className="btn-ghost text-xs">
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t("comments.deleteConfirm"))) {
                        deleteMutation.mutate(comment.id);
                      }
                    }}
                    className="btn-ghost text-xs text-red-600"
                  >
                    {t("comments.delete")}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {topLevel.map((comment) => {
        const commentReplies = repliesByParent[comment.id] || [];
        const isExpanded = expandedReplies[comment.id];
        const visibleReplies = isExpanded ? commentReplies : [];
        const hiddenCount = commentReplies.length;

        return (
          <div key={comment.id} className="space-y-1">
            {renderComment(comment)}
            {visibleReplies.map((reply) => renderComment(reply, true))}
            {!isExpanded && hiddenCount > 0 && (
              <button
                onClick={() => setExpandedReplies((prev) => ({ ...prev, [comment.id]: true }))}
                className="ml-10 inline-flex items-center gap-2 text-xs text-ink/60 hover:text-ink"
              >
                <span className="h-px w-6 bg-ink/20" />
                {t("comments.viewMoreReplies", { count: hiddenCount })}
              </button>
            )}
            {isExpanded && commentReplies.length > 0 && (
              <button
                onClick={() => setExpandedReplies((prev) => ({ ...prev, [comment.id]: false }))}
                className="ml-10 text-xs text-ink/60 hover:text-ink"
              >
                {t("comments.hideReplies")}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

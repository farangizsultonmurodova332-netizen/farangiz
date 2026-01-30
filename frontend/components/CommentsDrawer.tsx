"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { X } from "lucide-react";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/i18n";
import type { Comment } from "../lib/types";
import { timeAgo } from "../lib/format";

export default function CommentsDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { apiFetch, user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const commentsQuery = useQuery({
    queryKey: ["public-comments"],
    queryFn: () => apiFetch<Comment[]>("/comments/public/"),
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    enabled: isOpen,
  });

  const postCommentMutation = useMutation({
    mutationFn: (body: string) =>
      apiFetch("/comments/public/", {
        method: "POST",
        body: JSON.stringify({ body }),
      }),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["public-comments"] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/comments/public/${id}/`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-comments"] });
    },
  });

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const comments = commentsQuery.data || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-2xl z-50 flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-haze">
          <h2 className="text-xl font-semibold text-ink">{t("comments.publicTitle")}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-haze/50 rounded-lg transition-colors text-ink"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {commentsQuery.isLoading ? (
            <div className="text-center text-ink-muted py-8">{t("comments.loading")}</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-ink-muted py-8">
              <p className="text-lg font-medium">{t("comments.emptyTitle")}</p>
              <p className="text-sm mt-1">{t("comments.emptyBody")}</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-haze bg-card/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/users/${comment.author.id}`}
                        className="font-medium text-ink hover:text-primary text-sm truncate"
                        onClick={onClose}
                      >
                        {comment.author.username}
                      </Link>
                      <span className="text-xs text-ink-muted flex-shrink-0">
                        {timeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-ink/80 break-words whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>
                  {user?.id === comment.author.id && (
                    <button
                      onClick={() => {
                        if (confirm(t("comments.deleteConfirm"))) {
                          deleteCommentMutation.mutate(comment.id);
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-600 flex-shrink-0"
                    >
                      {t("comments.delete")}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        {user ? (
          <div className="p-4 border-t border-haze bg-card">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t("comments.placeholder")}
              className="w-full px-3 py-2 border border-haze rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-input text-ink placeholder:text-ink-muted/60"
              rows={3}
            />
            <button
              onClick={() => {
                if (newComment.trim()) {
                  postCommentMutation.mutate(newComment);
                }
              }}
              disabled={!newComment.trim() || postCommentMutation.isPending}
              className="btn-primary w-full mt-2"
            >
              {postCommentMutation.isPending ? t("comments.posting") : t("comments.postComment")}
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-haze bg-card text-center">
            <p className="text-sm text-ink-muted mb-2">{t("comments.signInToJoin")}</p>
            <Link href="/login" className="btn-primary inline-block" onClick={onClose}>
              {t("nav.signIn")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

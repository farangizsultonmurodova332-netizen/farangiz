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
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#242424] shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-haze dark:border-[#333333]">
          <h2 className="text-xl font-semibold text-ink dark:text-[#d4d4d4]">{t("comments.publicTitle")}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-haze/30 dark:hover:bg-[#333333] rounded-lg transition-colors text-ink dark:text-[#d4d4d4]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {commentsQuery.isLoading ? (
            <div className="text-center text-ink/50 dark:text-[#888888] py-8">{t("comments.loading")}</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-ink/50 dark:text-[#888888] py-8">
              <p className="text-lg font-medium">{t("comments.emptyTitle")}</p>
              <p className="text-sm mt-1">{t("comments.emptyBody")}</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-haze dark:border-[#333333] bg-white/50 dark:bg-[#2a2a2a] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/users/${comment.author.id}`}
                        className="font-medium text-ink dark:text-[#d4d4d4] hover:text-teal dark:hover:text-[#6eb5a8] text-sm truncate"
                        onClick={onClose}
                      >
                        {comment.author.username}
                      </Link>
                      <span className="text-xs text-ink/40 dark:text-[#666666] flex-shrink-0">
                        {timeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-ink/80 dark:text-[#a8a8a8] break-words whitespace-pre-wrap">
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
                      className="text-xs text-red-600 hover:text-red-700 flex-shrink-0"
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
          <div className="p-4 border-t border-haze dark:border-[#333333] bg-white dark:bg-[#242424]">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t("comments.placeholder")}
              className="w-full px-3 py-2 border border-haze dark:border-[#333333] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal/50 dark:focus:ring-[#4a9d8e]/50 text-sm bg-white dark:bg-[#2a2a2a] text-ink dark:text-[#a8a8a8] placeholder:text-ink/40 dark:placeholder:text-[#666666]"
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
          <div className="p-4 border-t border-haze dark:border-[#333333] bg-white dark:bg-[#242424] text-center">
            <p className="text-sm text-ink/60 dark:text-[#888888] mb-2">{t("comments.signInToJoin")}</p>
            <Link href="/login" className="btn-primary inline-block" onClick={onClose}>
              {t("nav.signIn")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

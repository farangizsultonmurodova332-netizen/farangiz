"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MessageCircle, Heart, Reply, Send, Pin } from "lucide-react";
import Link from "next/link";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/i18n";
import type { Comment } from "../lib/types";
import { timeAgo } from "../lib/format";

type ReplyTarget = {
  id: number;
  label: string;
};

export default function IdeaCommentsDrawer({
  isOpen,
  onClose,
  ideaId,
  ideaAuthorId,
  ideaTitle,
  comments,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  ideaId: number;
  ideaAuthorId?: number;
  ideaTitle?: string;
  comments: Comment[];
  isLoading: boolean;
}) {
  const { apiFetch, user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  const postCommentMutation = useMutation({
    mutationFn: ({ body, image }: { body: string; image: File | null }) => {
      const payload = new FormData();
      payload.append("body", body);
      if (replyTarget?.id) {
        payload.append("parent", String(replyTarget.id));
      }
      if (image) {
        payload.append("image", image);
      }
      return apiFetch(`/ideas/${ideaId}/comments`, {
        method: "POST",
        body: payload,
      });
    },
    onSuccess: () => {
      setNewComment("");
      setReplyTarget(null);
      setImageFile(null);
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
  });

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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const commentsList = Array.isArray(comments) ? comments : [];
  const topLevel = commentsList.filter((comment) => !comment.parent);
  const replies = commentsList.filter((comment) => comment.parent);

  const repliesByParent = useMemo(() => {
    const map = new Map<number, Comment[]>();
    replies.forEach((reply) => {
      const parentId = reply.parent as number;
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId)?.push(reply);
    });
    map.forEach((list, key) => {
      map.set(
        key,
        list.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      );
    });
    return map;
  }, [replies]);

  if (!isOpen) return null;

  const handleReply = (comment: Comment) => {
    const parentId = comment.parent ?? comment.id;
    setReplyTarget({
      id: parentId,
      label: `@${comment.author.username}`,
    });
  };

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const canSubmit = newComment.trim().length > 0 || !!imageFile;

  const handleSubmit = () => {
    if (!canSubmit) return;
    postCommentMutation.mutate({ body: newComment.trim(), image: imageFile });
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const renderLikeAction = (comment: Comment, dense?: boolean) => {
    const likeCount = comment.like_count ?? 0;
    const actionClass = dense ? "text-[11px]" : "text-xs";

    return (
      <div className="text-ink/60">
        {user ? (
          <button
            onClick={() => likeMutation.mutate(comment.id)}
            className={`inline-flex flex-col items-center ${actionClass} font-medium transition-colors hover:text-rose-600 ${comment.user_liked ? "text-rose-600" : "text-ink/60"
              }`}
          >
            <Heart size={14} className={comment.user_liked ? "fill-current" : ""} />
            {likeCount > 0 && <span className="mt-0.5 text-[10px]">{likeCount}</span>}
          </button>
        ) : (
          <span className={`inline-flex flex-col items-center ${actionClass} font-medium text-ink/40`}>
            <Heart size={14} />
            {likeCount > 0 && <span className="mt-0.5 text-[10px]">{likeCount}</span>}
          </span>
        )}
      </div>
    );
  };

  const renderPinAction = (comment: Comment) => {
    const isPinned = !!comment.is_pinned;
    const canToggle = !!user && !!ideaAuthorId && user.id === ideaAuthorId;
    if (!isPinned && !canToggle) return null;
    return (
      <button
        onClick={() => canToggle && pinMutation.mutate(comment.id)}
        aria-label={isPinned ? t("comments.unpin") : t("comments.pin")}
        className={`inline-flex items-center justify-center px-1 py-1 transition-colors ${isPinned ? "text-teal" : "text-ink/50"
          } ${canToggle ? "hover:text-ink" : "cursor-default"}`}
      >
        <Pin size={14} className={`-rotate-45 ${isPinned ? "fill-current" : ""}`} />
      </button>
    );
  };

  const renderReplyAction = (comment: Comment, dense?: boolean) => {
    if (!user) return null;
    const actionClass = dense ? "text-[11px]" : "text-xs";
    return (
      <button
        onClick={() => handleReply(comment)}
        className={`inline-flex items-center gap-1.5 ${actionClass} font-medium text-ink/60 hover:text-teal transition-colors`}
      >
        <Reply size={14} />
        {t("comments.reply")}
      </button>
    );
  };

  const renderComment = (comment: Comment, isReply: boolean) => {
    return (
      <div className={`flex items-start gap-3 py-2 ${isReply ? "ml-10" : ""}`}>
        <Link
          href={user && Number(comment.author.id) === user.id ? "/profile" : `/users/${comment.author.id}`}
          className={`shrink-0 overflow-hidden rounded-full ${isReply ? "w-7 h-7" : "w-9 h-9"}`}
          aria-label={`${comment.author.username} ${t("comments.profileLabel")}`}
        >
          {comment.author.avatar_url ? (
            <img
              src={comment.author.avatar_url}
              alt={`${comment.author.username} ${t("comments.avatar")}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal to-sky-500 text-white font-semibold text-xs">
              {comment.author.username.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className={`${isReply ? "text-xs" : "text-sm"} font-semibold text-ink truncate`}>
                  {comment.author.username}
                </p>
                {ideaAuthorId === Number(comment.author.id) && (
                  <span className="text-[9px] font-medium text-ink/40 lowercase">
                    {t("comments.authorBadge")}
                  </span>
                )}
                <span className="text-xs text-ink/40 whitespace-nowrap">{timeAgo(comment.created_at)}</span>
              </div>
              {comment.body && (
                <p className="text-sm text-ink/80 leading-relaxed mt-1">{comment.body}</p>
              )}
            </div>
            <div className="mt-1 flex items-start gap-2">
              {renderPinAction(comment)}
              {renderLikeAction(comment, true)}
            </div>
          </div>
          {comment.image_url && (
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200/60 bg-white/80">
              <img
                src={comment.image_url}
                alt={t("comments.attachment")}
                className="max-h-64 w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="mt-2 flex items-center gap-3">{renderReplyAction(comment, isReply)}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full lg:w-[380px] lg:self-start">
      <div className="rounded-3xl bg-card shadow-lg flex max-h-[calc(100vh-9rem)] flex-col border border-haze overflow-hidden">
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-haze bg-card/95 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2 text-ink flex-nowrap">
              <MessageCircle size={18} className="text-primary" />
              <h2 className="text-lg font-semibold whitespace-nowrap">{t("comments.title")}</h2>
              <span className="inline-flex items-center rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-semibold text-ink-muted whitespace-nowrap">
                {commentsList.length}{" "}
                {commentsList.length === 1 ? t("comments.single") : t("comments.plural")}
              </span>
              {ideaTitle && (
                <>
                  <span className="text-ink/30">-</span>
                  <span className="truncate text-sm font-medium text-ink/70 max-w-[180px]">
                    {ideaTitle}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-slate-200/70 text-ink/60 hover:text-ink hover:bg-slate-100 transition-all duration-200"
              aria-label={t("comments.close")}
            >
              <X size={20} className="text-ink/60" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3">
          {isLoading ? (
            <div className="text-center text-ink/50 py-12">
              <div className="animate-pulse">{t("comments.loading")}</div>
            </div>
          ) : commentsList.length === 0 ? (
            <div className="text-center text-ink/50 py-12 px-6">
              <MessageCircle size={48} className="mx-auto mb-3 text-ink/20" />
              <p className="text-lg font-medium text-ink/70">{t("comments.emptyTitle")}</p>
              <p className="text-sm mt-1">{t("comments.emptyBody")}</p>
            </div>
          ) : (
            topLevel.map((comment) => {
              const commentReplies = repliesByParent.get(comment.id) || [];
              const isExpanded = expandedReplies[comment.id];
              const visibleReplies = isExpanded ? commentReplies : [];
              const hiddenCount = commentReplies.length;

              return (
                <div key={comment.id} className="space-y-2">
                  {renderComment(comment, false)}
                  {visibleReplies.length > 0 && (
                    <div className="ml-9 space-y-1">
                      {visibleReplies.map((reply) => (
                        <div key={reply.id}>{renderComment(reply, true)}</div>
                      ))}
                    </div>
                  )}
                  {!isExpanded && hiddenCount > 0 && (
                    <button
                      onClick={() => setExpandedReplies((prev) => ({ ...prev, [comment.id]: true }))}
                      className="ml-12 inline-flex items-center gap-2 text-xs text-ink/60 hover:text-ink"
                    >
                      <span className="h-px w-6 bg-ink/20" />
                      {t("comments.viewMoreReplies", { count: hiddenCount })}
                    </button>
                  )}
                  {isExpanded && commentReplies.length > 0 && (
                    <button
                      onClick={() => setExpandedReplies((prev) => ({ ...prev, [comment.id]: false }))}
                      className="ml-12 text-xs text-ink/60 hover:text-ink"
                    >
                      {t("comments.hideReplies")}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {user ? (
          <div className="p-4 border-t border-slate-200 bg-white/90 backdrop-blur-sm">
            {replyTarget && (
              <div className="mb-3 flex items-center justify-between px-3 py-2 bg-teal/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Reply size={14} className="text-teal" />
                  <span className="text-xs font-medium text-teal">
                    {t("comments.replyingTo")} {replyTarget.label}
                  </span>
                </div>
                <button
                  onClick={() => setReplyTarget(null)}
                  className="text-xs text-teal hover:text-teal/70 font-medium"
                >
                  {t("profile.cancel")}
                </button>
              </div>
            )}
            {imagePreview && (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/80 p-2">
                <img
                  src={imagePreview}
                  alt={t("comments.selectedImage")}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <button
                  type="button"
                  className="text-xs font-medium text-ink/60 hover:text-ink"
                  onClick={() => {
                    if (imagePreview) {
                      URL.revokeObjectURL(imagePreview);
                    }
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  {t("comments.removeImage")}
                </button>
              </div>
            )}
            <div className="relative">
              <input
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && canSubmit) {
                    handleSubmit();
                  }
                }}
                placeholder={t("comments.placeholder")}
                className="w-full px-4 py-2 pr-24 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal/50 text-sm transition-all"
                type="text"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsEmojiOpen((prev) => !prev)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-ink/60 hover:text-ink hover:bg-slate-100"
                    aria-label={t("comments.addEmoji")}
                  >
                    :)
                  </button>
                  {isEmojiOpen && (
                    <div className="absolute bottom-9 right-0 z-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                      <Picker
                        data={emojiData}
                        onEmojiSelect={(emoji: { native: string }) => {
                          setNewComment((prev) => `${prev}${emoji.native}`);
                        }}
                        theme="light"
                        previewPosition="none"
                        skinTonePosition="none"
                        searchPosition="none"
                        perLine={7}
                        emojiSize={18}
                        style={{ width: 280, height: 320 }}
                      />
                    </div>
                  )}
                </div>
                <label className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-ink/60 hover:text-ink hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
                  />
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
                </label>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || postCommentMutation.isPending}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-teal to-sky-500 text-white hover:shadow-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t("comments.postComment")}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 border-t border-slate-200 bg-white/90 backdrop-blur-sm text-center">
            <MessageCircle size={32} className="mx-auto mb-3 text-ink/20" />
            <p className="text-sm text-ink/60 mb-3">{t("comments.signInPrompt")}</p>
            <a
              href="/login"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-teal to-sky-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
              onClick={onClose}
            >
              {t("nav.signIn")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

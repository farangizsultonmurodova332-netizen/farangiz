"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth";
import type { Notification, PaginatedResponse } from "../../lib/types";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import { timeAgo } from "../../lib/format";
import { useLanguage } from "../../lib/i18n";

function formatNotification(notification: Notification, t: (key: string) => string) {
  const actor = notification.actor?.username || t("notifications.someone");
  if (notification.notification_type === "follow") {
    return `${actor} ${t("notifications.followed")}`;
  }
  if (notification.notification_type === "like") {
    return `${actor} ${t("notifications.likedIdea")}`;
  }
  if (notification.notification_type === "comment") {
    return `${actor} ${t("notifications.commented")}`;
  }
  return notification.message;
}

export default function NotificationsPage() {
  const { apiFetch, user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiFetch<Notification[] | PaginatedResponse<Notification>>("/notifications/"),
    enabled: !!user,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => apiFetch("/notifications/read-all/", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.setQueryData(["unread-notifications-count"], 0);
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/notifications/${id}/read/`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (!user) {
    return (
      <EmptyState
        title={t("notifications.signInTitle")}
        description={t("notifications.signInBody")}
        actionLabel={t("nav.signIn")}
        actionHref="/login"
      />
    );
  }

  if (notificationsQuery.isLoading) return <Loading />;
  if (notificationsQuery.error) {
    return (
      <EmptyState
        title={t("notifications.unavailable")}
        description={(notificationsQuery.error as Error).message}
      />
    );
  }

  const rawData = notificationsQuery.data;
  const notifications = Array.isArray(rawData)
    ? rawData
    : rawData?.results || [];
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="section-title">{t("notifications.title")}</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => markAllReadMutation.mutate()}
            className="btn-secondary"
            disabled={unreadCount === 0 || markAllReadMutation.isPending}
          >
            {t("notifications.markAllRead")}
          </button>
          <a href="/" className="btn-secondary">
            {t("notifications.exploreIdeas")}
          </a>
        </div>
      </div>
      {notifications.length === 0 && (
        <EmptyState
          title={t("notifications.noneTitle")}
          description={t("notifications.noneBody")}
          actionLabel={t("notifications.shareIdea")}
          actionHref="/ideas/new"
        />
      )}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-ink/80">{formatNotification(notification, t)}</p>
              <p className="text-xs text-ink/50">{timeAgo(notification.created_at)}</p>
            </div>
            {!notification.is_read && (
              <button
                onClick={() => markReadMutation.mutate(notification.id)}
                className="btn-primary text-xs"
              >
                {t("notifications.markRead")}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

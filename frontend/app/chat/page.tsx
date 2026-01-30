"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import type { ChatRoom, User } from "../../lib/types";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import { timeAgo } from "../../lib/format";
import { useLanguage } from "../../lib/i18n";
import { useEffect, useState } from "react";

export default function ChatListPage() {
  const { apiFetch, user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "groups" | "direct">("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const roomsQuery = useQuery({
    queryKey: ["chat-rooms"],
    queryFn: () => apiFetch<ChatRoom[]>("/chat/rooms/"),
    enabled: !!user,
  });

  const searchUsersQuery = useQuery({
    queryKey: ["chat-user-search", debouncedQuery],
    queryFn: () =>
      apiFetch<User[] | { results: User[] }>(`/users?search=${encodeURIComponent(debouncedQuery)}`),
    enabled: !!user && debouncedQuery.length > 1,
  });

  const searchGroupsQuery = useQuery({
    queryKey: ["chat-group-search", debouncedQuery],
    queryFn: () =>
      apiFetch<ChatRoom[] | { results: ChatRoom[] }>(
        `/chat/rooms/groups?search=${encodeURIComponent(debouncedQuery)}`
      ),
    enabled: !!user && debouncedQuery.length > 1,
  });

  const startChatMutation = useMutation({
    mutationFn: (targetId: number) =>
      apiFetch<ChatRoom>("/chat/rooms/get-or-create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ other_user_id: targetId }),
      }),
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      setSearchQuery("");
      router.push(`/chat/${room.id}`);
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: (roomId: number) =>
      apiFetch(`/chat/rooms/${roomId}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      setOpenMenuId(null);
    },
  });

  const joinGroupMutation = useMutation({
    mutationFn: (roomId: number) =>
      apiFetch<ChatRoom>(`/chat/rooms/${roomId}/join/`, {
        method: "POST",
      }),
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      setSearchQuery("");
      router.push(`/chat/${room.id}`);
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: (roomId: number) =>
      apiFetch(`/chat/rooms/${roomId}/leave/`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      setOpenMenuId(null);
    },
  });

  if (!user) {
    return (
      <EmptyState
        title={t("chat.signInTitle")}
        description={t("chat.signInBody")}
        actionLabel={t("nav.signIn")}
        actionHref="/login"
      />
    );
  }

  if (roomsQuery.isLoading) return <Loading />;

  if (roomsQuery.error) {
    return (
      <EmptyState
        title={t("common.somethingWrong")}
        description={(roomsQuery.error as Error).message || t("error.body")}
        actionLabel={t("chat.tryAgain")}
        actionHref="/chat"
      />
    );
  }

  // Handle both array and paginated response formats
  const rawData = roomsQuery.data;
  const rooms: ChatRoom[] = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.results || [];
  const baseRooms = rooms.filter((room: ChatRoom) => room.is_group || room.last_message);
  const visibleRooms = baseRooms.filter((room: ChatRoom) => {
    if (activeTab === "groups") return room.is_group;
    if (activeTab === "direct") return !room.is_group;
    return true;
  });

  if (visibleRooms.length === 0) {
    return (
      <EmptyState
        title={t("chat.noConversations")}
        description={t("chat.noConversationsBody")}
        actionLabel={t("chat.exploreIdeas")}
        actionHref="/"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-ink">{t("chat.title")}</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`btn-secondary ${activeTab === "all" ? "bg-ink text-white" : ""}`}
          >
            {t("chat.allChats")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("groups")}
            className={`btn-secondary ${activeTab === "groups" ? "bg-ink text-white" : ""}`}
          >
            {t("chat.groups")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("direct")}
            className={`btn-secondary ${activeTab === "direct" ? "bg-ink text-white" : ""}`}
          >
            {t("chat.directChats")}
          </button>
        </div>
        <div className="relative z-30">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t("chat.searchPlaceholder")}
            className="input pr-10"
          />
          {searchQuery.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              aria-label={t("common.clear")}
            >
              ×
            </button>
          )}
          {debouncedQuery.length > 1 && (
            <div className="absolute z-40 mt-2 w-full rounded-2xl border border-haze bg-card/95 shadow-lg">
              {searchUsersQuery.isLoading && (
                <div className="p-4 text-sm text-ink/60">{t("common.loading")}</div>
              )}
              {!searchUsersQuery.isLoading && (
                <div className="max-h-64 overflow-y-auto">
                  {(() => {
                    const data = searchUsersQuery.data;
                    const results = Array.isArray(data) ? data : data?.results || [];
                    const groupData = searchGroupsQuery.data;
                    const groupResults = Array.isArray(groupData) ? groupData : groupData?.results || [];
                    if (results.length === 0 && groupResults.length === 0) {
                      return (
                        <div className="p-4 text-sm text-ink/60">{t("chat.noSearchResults")}</div>
                      );
                    }
                    return (
                      <div className="space-y-2 py-2">
                        {groupResults.length > 0 && (
                          <div className="px-4 text-xs font-semibold uppercase tracking-wide text-ink/40">
                            {t("chat.groups")}
                          </div>
                        )}
                        {groupResults.map((group) => (
                          <button
                            key={`group-${group.id}`}
                            type="button"
                            onClick={() => joinGroupMutation.mutate(group.id)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-haze/60"
                          >
                            <div className="flex items-center gap-3">
                              {group.avatar_url ? (
                                <img
                                  src={group.avatar_url}
                                  alt={group.name || t("chat.group")}
                                  className="h-9 w-9 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-haze text-ink/70 flex items-center justify-center text-sm font-semibold">
                                  {(group.name || t("chat.group")).slice(0, 1).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-ink">
                                  {typeof group.member_count === "number"
                                    ? `${group.member_count} • ${group.name}`
                                    : group.name}
                                </p>
                                <p className="text-xs text-ink/50">{t("chat.joinGroup")}</p>
                              </div>
                            </div>
                            <span className="text-xs text-ink/40">{t("chat.group")}</span>
                          </button>
                        ))}
                        {results.length > 0 && (
                          <div className="px-4 text-xs font-semibold uppercase tracking-wide text-ink/40">
                            {t("chat.users")}
                          </div>
                        )}
                        {results.map((result) => (
                          <button
                            key={result.id}
                            type="button"
                            onClick={() => startChatMutation.mutate(result.id)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-haze/60"
                          >
                            <div className="flex items-center gap-3">
                              {result.avatar_url ? (
                                <img
                                  src={result.avatar_url}
                                  alt={result.username}
                                  className="h-9 w-9 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-haze text-ink/70 flex items-center justify-center text-sm font-semibold">
                                  {result.username.slice(0, 1).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-ink">{result.username}</p>
                                <p className="text-xs text-ink/50">{t("chat.startChat")}</p>
                              </div>
                            </div>
                            <span className="text-xs text-ink/40">{t("chat.message")}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {visibleRooms.map((room) => {
          const isMenuOpen = openMenuId === room.id;
          return (
            <button
              key={room.id}
              onClick={() => router.push(`/chat/${room.id}`)}
              className={`card relative p-3 w-full text-left hover:bg-haze/50 transition-colors overflow-visible ${isMenuOpen ? "z-20" : "z-0"
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="relative">
                    {room.is_group ? (
                      room.avatar_url ? (
                        <img
                          src={room.avatar_url}
                          alt={room.name || t("chat.group")}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-haze text-ink/70 flex items-center justify-center text-sm font-semibold">
                          {(room.name || t("chat.group")).slice(0, 1).toUpperCase()}
                        </div>
                      )
                    ) : room.other_user?.avatar_url ? (
                      <img
                        src={room.other_user.avatar_url}
                        alt={room.other_user.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-haze text-ink/70 flex items-center justify-center text-sm font-semibold">
                        {(room.other_user?.username || t("chat.unknownUser")).slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    {!room.is_group && room.other_user?.is_online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink">
                        {room.is_group
                          ? `${room.member_count ?? 0} • ${room.name || t("chat.group")}`
                          : room.other_user?.username || t("chat.unknownUser")}
                      </p>
                      {!room.is_group && room.other_user?.last_seen && (
                        <span className="text-xs text-ink/50">
                          {t("chat.lastSeen", { time: timeAgo(room.other_user.last_seen) })}
                        </span>
                      )}
                      {room.unread_count > 0 && (
                        <span className="pill bg-teal text-white text-xs">
                          {room.unread_count}
                        </span>
                      )}
                    </div>
                    {room.last_message && (
                      <p className="text-sm text-ink/60 mt-1 truncate">
                        <span className="font-medium">{room.last_message.sender}:</span>{" "}
                        {room.last_message.body}
                      </p>
                    )}
                    {!room.last_message && room.is_group && (
                      <p className="text-sm text-ink/50 mt-1">{t("chat.groupNoMessages")}</p>
                    )}
                    {room.last_message && (
                      <div className="mt-1 flex w-full justify-end">
                        <span className="text-xs text-ink/40 whitespace-nowrap">
                          {timeAgo(room.last_message.created_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenMenuId((prev) => (prev === room.id ? null : room.id));
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 hover:bg-haze/60 hover:text-ink"
                  aria-label={t("chat.menu")}
                >
                  <span className="text-lg leading-none">•••</span>
                </button>
                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-44 rounded-xl border border-haze bg-card shadow-lg z-30"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (room.is_group && room.created_by !== user?.id) {
                          if (!confirm(t("chat.leaveGroupConfirm"))) return;
                          leaveGroupMutation.mutate(room.id);
                          return;
                        }
                        if (!confirm(t("chat.deleteChatConfirm"))) return;
                        deleteChatMutation.mutate(room.id);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-haze/60"
                    >
                      {room.is_group && room.created_by !== user?.id ? t("chat.leaveGroup") : t("chat.deleteChat")}
                    </button>
                    {!room.is_group && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          if (room.other_user?.id) {
                            router.push(`/users/${room.other_user.id}`);
                          }
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-ink/70 hover:bg-haze/60"
                      >
                        {t("chat.viewProfile")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
}

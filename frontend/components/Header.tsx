"use client";

import Link from "next/link";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { Bell, Compass, LogIn, MessageCircle, PlusCircle, UserCircle } from "lucide-react";

export default function Header() {
  const { user, apiFetch } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  // Fetch unread notifications count
  const { data: unreadCount } = useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: async () => {
      const data = await apiFetch<any>("/notifications/");
      // Count unread notifications
      const notifications = Array.isArray(data) ? data : data?.results || [];
      return notifications.filter((n: any) => !n.is_read).length;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: unreadMessagesCount } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: async () => {
      const data = await apiFetch<any>("/chat/rooms/");
      const rooms = Array.isArray(data) ? data : data?.results || [];
      return rooms.reduce((total: number, room: any) => total + (room.unread_count || 0), 0);
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  return (
    <header className="border-b border-white/60 bg-white/70 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center" aria-label="Crowdsourced Idea Bank">
          <img src="/logo.svg" alt="Crowdsourced Idea Bank" className="h-8 w-auto dark:invert" />
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className="btn-ghost">
            <Compass size={16} /> {t("nav.explore")}
          </Link>
          <Link href="/ideas/new" className="btn-primary">
            <PlusCircle size={16} /> {t("nav.newIdea")}
          </Link>
          {user ? (
            <>
              <Link href="/chat" className="btn-ghost relative">
                <MessageCircle size={16} /> {t("nav.messages")}
                {unreadMessagesCount !== undefined && unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-semibold">
                    {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                  </span>
                )}
              </Link>
              <Link href="/notifications" className="btn-ghost relative">
                <Bell size={16} /> <span>{t("nav.notifications")}</span>
                {unreadCount !== undefined && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="btn-ghost">
                <UserCircle size={16} /> {user.username}
              </Link>
            </>
          ) : (
            <Link href="/login" className="btn-secondary">
              <LogIn size={16} /> {t("nav.signIn")}
            </Link>
          )}
          <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1 dark:border-gray-600 dark:bg-gray-800">
            <span className="text-xs text-ink/60 dark:text-gray-400">{t("lang.label")}</span>
            <select
              className="bg-transparent text-xs font-semibold text-ink focus:outline-none dark:text-gray-200"
              value={language}
              onChange={(event) => setLanguage(event.target.value as "en" | "ru" | "uz")}
            >
              <option value="en" className="dark:bg-gray-800">EN</option>
              <option value="ru" className="dark:bg-gray-800">RU</option>
              <option value="uz" className="dark:bg-gray-800">UZ</option>
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}


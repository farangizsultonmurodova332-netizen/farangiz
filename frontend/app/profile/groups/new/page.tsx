"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EmptyState from "../../../../components/EmptyState";
import { useAuth } from "../../../../lib/auth";
import { useLanguage } from "../../../../lib/i18n";
import type { User } from "../../../../lib/types";

export default function CreateGroupPage() {
  const { user, apiFetch } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isGroupPrivate, setIsGroupPrivate] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  const searchUsersQuery = useQuery({
    queryKey: ["group-member-search", memberSearch],
    queryFn: () =>
      apiFetch<User[] | { results: User[] }>(`/users?search=${encodeURIComponent(memberSearch)}`),
    enabled: !!user && memberSearch.trim().length > 1,
  });

  const createGroupMutation = useMutation({
    mutationFn: () =>
      apiFetch<any>("/chat/rooms/create-group/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName.trim(),
          description: groupDescription.trim(),
          is_private: isGroupPrivate,
          member_ids: selectedMembers.map((member) => member.id),
        }),
      }),
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      router.push(`/chat/${room.id}`);
    },
  });

  if (!user) {
    return (
      <EmptyState
        title={t("profile.signInViewTitle")}
        description={t("profile.signInViewBody")}
        actionLabel={t("nav.signIn")}
        actionHref="/login"
      />
    );
  }

  const searchResults = Array.isArray(searchUsersQuery.data)
    ? searchUsersQuery.data
    : searchUsersQuery.data?.results || [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t("profile.createGroup")}</h1>
          <p className="text-sm text-ink/60">{t("profile.createGroupHint")}</p>
        </div>
        <Link href="/profile" className="btn-secondary">
          {t("common.back")}
        </Link>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">{t("profile.groupName")}</label>
          <input
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            className="input mt-2"
            placeholder={t("profile.groupNamePlaceholder")}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">{t("profile.groupDescription")}</label>
          <textarea
            value={groupDescription}
            onChange={(event) => setGroupDescription(event.target.value)}
            className="input mt-2 min-h-[90px] resize-none"
            placeholder={t("profile.groupDescriptionPlaceholder")}
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            id="group-private"
            type="checkbox"
            checked={isGroupPrivate}
            onChange={(event) => setIsGroupPrivate(event.target.checked)}
          />
          <label htmlFor="group-private" className="text-sm text-ink/70">
            {t("profile.groupPrivate")}
          </label>
        </div>
        <div>
          <label className="text-sm font-medium text-ink">{t("profile.groupMembers")}</label>
          <input
            value={memberSearch}
            onChange={(event) => setMemberSearch(event.target.value)}
            className="input mt-2"
            placeholder={t("profile.groupMemberSearchPlaceholder")}
          />
          {memberSearch.trim().length > 1 && (
            <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-haze">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => {
                    if (selectedMembers.find((member) => member.id === result.id)) return;
                    setSelectedMembers((prev) => [...prev, result]);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-haze/60"
                >
                  <span className="font-semibold text-ink">{result.username}</span>
                  <span className="text-xs text-ink/50">{t("profile.addMember")}</span>
                </button>
              ))}
              {searchResults.length === 0 && (
                <div className="px-3 py-2 text-sm text-ink/50">{t("chat.noSearchResults")}</div>
              )}
            </div>
          )}
          {selectedMembers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedMembers.map((member) => (
                <span
                  key={member.id}
                  className="inline-flex items-center gap-2 rounded-full bg-haze px-3 py-1 text-xs text-ink/70"
                >
                  {member.username}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedMembers((prev) => prev.filter((item) => item.id !== member.id))
                    }
                    className="text-ink/50 hover:text-ink"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Link href="/profile" className="btn-secondary">
            {t("common.cancel")}
          </Link>
          <button
            type="button"
            className="btn-primary"
            disabled={!groupName.trim() || createGroupMutation.isPending}
            onClick={() => createGroupMutation.mutate()}
          >
            {t("common.create")}
          </button>
        </div>
      </div>
    </div>
  );
}

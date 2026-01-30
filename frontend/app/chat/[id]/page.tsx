"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth";
import { useWebSocket } from "../../../lib/useWebSocket";
import { useCall } from "../../../hooks/useCall";
import type { ChatRoom, ChatMessage, User, CallSignal } from "../../../lib/types";
import Loading from "../../../components/Loading";
import EmptyState from "../../../components/EmptyState";
import { timeAgo } from "../../../lib/format";
import { useLanguage } from "../../../lib/i18n";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { Phone, Video } from "lucide-react";

type ChatRoomContentProps = {
  roomId: number;
  user: User;
  apiFetch: <T = any>(path: string, options?: RequestInit) => Promise<T>;
};

function ChatRoomContent({ roomId, user, apiFetch }: ChatRoomContentProps) {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { startCall, handleIncomingCallSignal } = useCall();

  /* State */
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [showAdminsOnly, setShowAdminsOnly] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);
  const [adminPermissions, setAdminPermissions] = useState({
    can_delete_messages: false,
    can_kick: false,
    can_invite: false,
  });
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const swipeStartRef = useRef<{ x: number; y: number; messageId: number } | null>(null);

  const roomQuery = useQuery({
    queryKey: ["chat-room", roomId],
    queryFn: () => apiFetch<ChatRoom>(`/chat/rooms/${roomId}/`),
    enabled: !!user,
  });

  const messagesQuery = useQuery({
    queryKey: ["chat-messages", roomId],
    queryFn: () => apiFetch<ChatMessage[]>(`/chat/rooms/${roomId}/messages/`),
    enabled: !!user && !!roomQuery.data,
  });

  const membersQuery = useQuery({
    queryKey: ["chat-members", roomId],
    queryFn: () => apiFetch<any[]>(`/chat/rooms/${roomId}/members`),
    enabled: !!user && !!roomQuery.data?.is_group && isMembersOpen,
  });

  const searchUsersQuery = useQuery({
    queryKey: ["chat-member-search", roomId, memberSearch],
    queryFn: () => apiFetch<User[] | { results: User[] }>(`/users?search=${encodeURIComponent(memberSearch)}`),
    enabled: !!user && !!roomQuery.data?.is_group && memberSearch.trim().length > 1,
  });

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
  }, [messagesQuery.data]);


  const { isConnected, sendMessage, sendTyping } = useWebSocket({
    roomId,
    onCallSignal: handleIncomingCallSignal,
    onMessage: useCallback(
      (message: ChatMessage) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
        queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      },
      [queryClient]
    ),
    onMessageUpdated: useCallback((message: ChatMessage) => {
      setMessages((prev) => prev.map((item) => (item.id === message.id ? message : item)));
    }, []),
    onMessageDeleted: useCallback((message: ChatMessage) => {
      setMessages((prev) => prev.map((item) => (item.id === message.id ? message : item)));
    }, []),
    onTyping: useCallback(
      (userId: number, username: string) => {
        if (userId !== user?.id) {
          setTypingUser(username);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
          }, 3000);
        }
      },
      [user]
    ),
  });

  const handleReply = (message: ChatMessage) => {
    setReplyToMessage(message);
    setEditingMessage(null);
    inputRef.current?.focus();
  };

  const handleEdit = (message: ChatMessage) => {
    setEditingMessage(message);
    setReplyToMessage(null);
    setMessageBody(message.body || "");
    inputRef.current?.focus();
  };

  const handleDelete = async (message: ChatMessage) => {
    if (!confirm(t("chat.deleteConfirm"))) return;
    try {
      const deleted = await apiFetch<ChatMessage>(`/chat/rooms/${roomId}/messages/${message.id}/`, {
        method: "DELETE",
      });
      setMessages((prev) => prev.map((item) => (item.id === deleted.id ? deleted : item)));
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
    } catch (error) {
      alert(t("chat.deleteFailed"));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);

  const startRecording = async () => {
    if (isRecording) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      alert(t("chat.recordUnavailable"));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const track = stream.getAudioTracks()[0];
      if (!track) {
        alert(t("chat.recordNoInput"));
        stream.getTracks().forEach((activeTrack) => activeTrack.stop());
        return;
      }
      if (!track.enabled || track.muted) {
        alert(t("chat.recordMuted"));
        stream.getTracks().forEach((activeTrack) => activeTrack.stop());
        return;
      }
      const supportedMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
        "audio/mp4",
      ];
      const mimeType =
        supportedMimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || "";
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (blob.size === 0) {
          alert(t("chat.recordEmpty"));
          setIsRecording(false);
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const extensionMap: Record<string, string> = {
          "audio/webm": "webm",
          "audio/ogg": "ogg",
          "audio/mp4": "m4a",
        };
        const baseType = blob.type.split(";")[0];
        const extension = extensionMap[baseType] || "webm";
        const file = new File([blob], `voice-${Date.now()}.${extension}`, { type: blob.type });
        if (audioPreview) {
          URL.revokeObjectURL(audioPreview);
        }
        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(blob));
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecording(true);
    } catch (error) {
      alert(t("chat.recordFailed"));
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageBody.trim() && !imageFile && !audioFile && !editingMessage) return;

    if (editingMessage) {
      if (!messageBody.trim() && !editingMessage.image_url && !editingMessage.audio_url) return;
      try {
        const updated = await apiFetch<ChatMessage>(`/chat/rooms/${roomId}/messages/${editingMessage.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: messageBody.trim() }),
        });
        setMessages((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setEditingMessage(null);
        setMessageBody("");
        queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
        return;
      } catch (error) {
        alert(t("chat.editFailed"));
        return;
      }
    }

    const useSocket = !imageFile && !audioFile && !replyToMessage;
    if (useSocket) {
      const sent = sendMessage(messageBody);
      if (sent) {
        setMessageBody("");
        return;
      }
    }

    try {
      let body: BodyInit;
      let headers: HeadersInit | undefined;
      if (imageFile || audioFile) {
        const payload = new FormData();
        if (messageBody.trim()) {
          payload.append("body", messageBody.trim());
        }
        if (imageFile) {
          payload.append("image", imageFile);
        }
        if (audioFile) {
          payload.append("audio", audioFile);
        }
        if (replyToMessage) {
          payload.append("reply_to", String(replyToMessage.id));
        }
        body = payload;
      } else {
        body = JSON.stringify({
          body: messageBody,
          reply_to: replyToMessage?.id ?? null,
        });
        headers = { "Content-Type": "application/json" };
      }
      const message = await apiFetch<any>(`/chat/rooms/${roomId}/send_message/`, {
        method: "POST",
        body,
        headers,
      });
      if (!isConnected) {
        setMessages((prev) => [...prev, message]);
      }
      setMessageBody("");
      setReplyToMessage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(null);
      setImagePreview(null);
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
      setAudioFile(null);
      setAudioPreview(null);
      scrollToBottom();
    } catch (error) {
      alert(t("chat.sendFailed"));
    }
  };

  const handleTyping = () => {
    sendTyping();
  };

  const addMemberMutation = useMutation({
    mutationFn: (userId: number) =>
      apiFetch(`/chat/rooms/${roomId}/add-member/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      }),
    onSuccess: () => {
      membersQuery.refetch();
      setMemberSearch("");
      setShowInvite(false);
    },
  });

  const kickMemberMutation = useMutation({
    mutationFn: (userId: number) =>
      apiFetch(`/chat/rooms/${roomId}/kick/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      }),
    onSuccess: () => {
      membersQuery.refetch();
    },
  });

  const setAdminMutation = useMutation({
    mutationFn: (payload: { userId: number; isFull?: boolean; removeAdmin?: boolean }) =>
      apiFetch(`/chat/rooms/${roomId}/set-admin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: payload.userId,
          is_full_admin: payload.isFull,
          remove_admin: payload.removeAdmin,
          ...adminPermissions,
        }),
      }),
    onSuccess: () => {
      membersQuery.refetch();
      setEditingAdminId(null);
    },
  });

  const handleSwipeStart = (event: React.TouchEvent, message: ChatMessage) => {
    const touch = event.touches[0];
    if (!touch) return;
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY, messageId: message.id };
  };

  const handleSwipeEnd = (event: React.TouchEvent, message: ChatMessage) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start || start.messageId !== message.id) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = Math.abs(touch.clientY - start.y);
    if (deltaX > 60 && deltaY < 30) {
      handleReply(message);
    }
  };

  if (roomQuery.isLoading) return <Loading />;
  if (roomQuery.error) {
    return (
      <EmptyState
        title={t("chat.chatNotFound")}
        description={(roomQuery.error as Error).message}
        actionLabel={t("chat.backToMessages")}
        actionHref="/chat"
      />
    );
  }

  const room = roomQuery.data;
  const isGroup = !!room?.is_group;
  const membership = room?.membership;
  const isOwner = membership?.role === "owner";
  const canManageAdmins =
    membership?.role === "owner" || membership?.can_manage_admins;
  const canInvite = membership?.role === "owner" || membership?.can_invite;
  const canKick = membership?.role === "owner" || membership?.can_kick;
  const canDeleteAny =
    membership?.role === "owner" || membership?.can_delete_messages;

  if (!room) {
    return (
      <EmptyState
        title={t("chat.chatNotFound")}
        description={t("chat.chatNotFoundBody")}
        actionLabel={t("chat.backToMessages")}
        actionHref="/chat"
      />
    );
  }

  const members = membersQuery.data || [];
  const memberIds = new Set(members.map((member) => member.id));
  const visibleMembers = showAdminsOnly
    ? members.filter((member) => member.role !== "member")
    : members;

  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      <div className="card flex flex-col h-[calc(100vh-200px)] overflow-x-hidden">
        <div className="p-4 border-b border-ink/10 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-ink">
              {isGroup ? room.name : room.other_user?.username || t("chat.unknownUser")}
            </h2>
            <p className="text-xs text-ink/50">
              {isConnected ? (
                <span className="text-green-600">{t("chat.connected")}</span>
              ) : (
                <span className="text-red-600">{t("chat.disconnected")}</span>
              )}
              {" - "}
              {messages.length} {messages.length === 1 ? t("chat.message") : t("chat.messages")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isGroup && room.other_user && (
              <>
                <button
                  title={t("call.voiceCall")}
                  className="btn-secondary text-sm p-2"
                  onClick={() => startCall(roomId, room.other_user!, 'voice')}
                >
                  <Phone size={20} />
                </button>
                <button
                  title={t("call.videoCall")}
                  className="btn-secondary text-sm p-2"
                  onClick={() => startCall(roomId, room.other_user!, 'video')}
                >
                  <Video size={20} />
                </button>
              </>
            )}
            {isGroup && (
              <button
                type="button"
                className="btn-secondary text-sm"
                onClick={() => setIsMembersOpen(true)}
              >
                {t("chat.members")}
              </button>
            )}
            <a href="/chat" className="btn-secondary text-sm">
              {t("common.back")}
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3">
          {messagesQuery.isLoading && <Loading />}
          {messages.length === 0 && !messagesQuery.isLoading && (
            <div className="text-center text-ink/50 py-8">
              <p>{t("chat.noMessages")}</p>
            </div>
          )}
          {messages.map((message) => {
            const isMine = message.sender_id === user.id;
            const replyPreview = message.reply_to_preview;
            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                onTouchStart={(event) => handleSwipeStart(event, message)}
                onTouchEnd={(event) => handleSwipeEnd(event, message)}
              >
                <div
                  className={`group relative max-w-[70%] min-w-[160px] rounded-2xl px-4 py-2 ${isMine ? "bg-teal text-white" : "bg-haze text-ink"
                    }`}
                >
                  {replyPreview && (
                    <div className={`mb-2 rounded-xl px-3 py-2 text-xs ${isMine ? "bg-white/20" : "bg-ink/5"}`}>
                      <p className={`font-semibold ${isMine ? "text-white/80" : "text-ink/70"}`}>
                        {t("chat.replyingTo")} {replyPreview.sender_username}
                      </p>
                      <p className={`${isMine ? "text-white/80" : "text-ink/60"}`}>
                        {replyPreview.is_deleted ? t("chat.deletedMessage") : replyPreview.body}
                      </p>
                    </div>
                  )}
                  {!isMine && (
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {message.sender_username}
                    </p>
                  )}
                  {message.is_deleted ? (
                    <p className={`break-words italic ${isMine ? "text-white/80" : "text-ink/60"}`}>
                      {t("chat.deletedMessage")}
                    </p>
                  ) : (
                    <>
                      {message.body && (
                        <div className="flex items-end gap-2">
                          <p className="break-words flex-1">{message.body}</p>
                          <span
                            className={`text-xs whitespace-nowrap ${isMine ? "text-white/70" : "text-ink/50"}`}
                          >
                            {timeAgo(message.created_at)}
                            {message.is_edited && <span>{` • ${t("chat.edited")}`}</span>}
                          </span>
                        </div>
                      )}
                      {message.image_url && (
                        <a
                          href={message.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block"
                        >
                          <img
                            src={message.image_url}
                            alt={t("chat.imageAttachment")}
                            className={`w-full max-w-xs rounded-2xl border object-cover ${isMine ? "border-white/30" : "border-ink/10"
                              }`}
                            loading="lazy"
                          />
                        </a>
                      )}
                      {message.audio_url && (
                        <audio
                          controls
                          preload="metadata"
                          src={message.audio_url}
                          className={`mt-2 w-full min-w-[220px] max-w-sm rounded-2xl ${isMine ? "border border-white/30" : "border border-ink/10"
                            }`}
                        />
                      )}
                    </>
                  )}
                  <div className="absolute -top-2 -right-2 hidden items-center gap-1 rounded-full bg-card border border-haze px-2 py-1 text-[11px] text-ink shadow-sm group-hover:flex">
                    <button
                      type="button"
                      onClick={() => handleReply(message)}
                      className="font-medium text-ink/70 hover:text-ink"
                    >
                      {t("chat.reply")}
                    </button>
                    {(isMine || (isGroup && canDeleteAny)) && !message.is_deleted && (
                      <>
                        {isMine && (
                          <>
                            <span className="text-ink/30">•</span>
                            <button
                              type="button"
                              onClick={() => handleEdit(message)}
                              className="font-medium text-ink/70 hover:text-ink"
                            >
                              {t("chat.edit")}
                            </button>
                          </>
                        )}
                        <span className="text-ink/30">•</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(message)}
                          className="font-medium text-ink/70 hover:text-ink"
                        >
                          {t("chat.delete")}
                        </button>
                      </>
                    )}
                  </div>
                  {(!message.body || message.is_deleted) && (
                    <div className={`mt-1 flex justify-end text-xs ${isMine ? "text-white/70" : "text-ink/50"}`}>
                      {timeAgo(message.created_at)}
                      {message.is_edited && !message.is_deleted && (
                        <span>{` • ${t("chat.edited")}`}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {typingUser && (
            <div className="flex justify-start">
              <div className="bg-haze text-ink rounded-2xl px-4 py-2">
                <p className="text-xs italic">
                  {typingUser} {t("chat.typing")}
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-ink/10">
          {editingMessage && (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-haze bg-card/50 px-3 py-2 text-xs">
              <span className="font-medium text-ink/70">{t("chat.editing")}</span>
              <button
                type="button"
                className="font-medium text-ink/60 hover:text-ink"
                onClick={() => {
                  setEditingMessage(null);
                  setMessageBody("");
                }}
              >
                {t("common.cancel")}
              </button>
            </div>
          )}
          {replyToMessage && !editingMessage && (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-haze bg-card/50 px-3 py-2 text-xs">
              <span className="text-ink/70">
                {t("chat.replyingTo")}{" "}
                <strong className="font-semibold">{replyToMessage.sender_username}</strong>
              </span>
              <button
                type="button"
                className="font-medium text-ink/60 hover:text-ink"
                onClick={() => setReplyToMessage(null)}
              >
                {t("common.cancel")}
              </button>
            </div>
          )}
          {imagePreview && (
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-haze bg-card/50 p-2">
              <img
                src={imagePreview}
                alt={t("chat.selectedImage")}
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
                {t("chat.removeImage")}
              </button>
            </div>
          )}
          {audioPreview && (
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-haze bg-card/50 p-2">
              <audio controls preload="metadata" src={audioPreview} className="w-full min-w-[220px] max-w-sm" />
              <button
                type="button"
                className="text-xs font-medium text-ink/60 hover:text-ink"
                onClick={() => {
                  if (audioPreview) {
                    URL.revokeObjectURL(audioPreview);
                  }
                  setAudioFile(null);
                  setAudioPreview(null);
                }}
              >
                {t("chat.removeAudio")}
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsEmojiOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 hover:text-ink hover:bg-haze/50"
                aria-label={t("chat.addEmoji")}
              >
                :)
              </button>
              {isEmojiOpen && (
                <div className="absolute bottom-11 left-0 z-10 overflow-hidden rounded-xl border border-haze bg-card shadow-lg">
                  <Picker
                    data={emojiData}
                    onEmojiSelect={(emoji: { native: string }) => {
                      setMessageBody((prev) => `${prev}${emoji.native}`);
                      setIsEmojiOpen(false);
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
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${isRecording ? "border-red-500 text-red-600" : "border-ink/10 text-ink/60"
                } hover:text-ink hover:bg-haze/50`}
              aria-label={isRecording ? t("chat.stopRecording") : t("chat.startRecording")}
              disabled={!!editingMessage}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-ink/10 text-ink/60 hover:text-ink hover:bg-haze/50">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  if (!file) return;
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
                disabled={!!editingMessage}
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
            <input
              ref={inputRef}
              type="text"
              value={messageBody}
              onChange={(event) => {
                setMessageBody(event.target.value);
                handleTyping();
              }}
              placeholder={t("chat.typeMessage")}
              className="input flex-1"
              maxLength={2000}
              disabled={!isConnected}
            />
            <button
              type="submit"
              disabled={(!messageBody.trim() && !imageFile && !audioFile && !editingMessage) || !isConnected}
              className="btn-primary disabled:opacity-50"
            >
              {editingMessage ? t("chat.save") : t("chat.send")}
            </button>
          </div>
          <p className="text-xs text-ink/40 mt-1">
            {messageBody.length}/2000 {t("chat.characters")}
            {!isConnected && ` - ${t("chat.disconnected")}`}
          </p>
        </form>
      </div>

      {isGroup && isMembersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ink">{t("chat.members")}</h3>
                <p className="text-sm text-ink/60">{t("chat.membersHint")}</p>
              </div>
              <button
                type="button"
                className="text-ink/40 hover:text-ink"
                onClick={() => {
                  setIsMembersOpen(false);
                  setEditingAdminId(null);
                  setShowInvite(false);
                  setShowAdminsOnly(false);
                  setMemberSearch("");
                }}
                aria-label={t("common.cancel")}
              >
                ×
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {canInvite && (
                <button
                  type="button"
                  className={`btn-secondary text-xs ${showInvite ? "bg-ink text-white" : ""}`}
                  onClick={() => setShowInvite((prev) => !prev)}
                >
                  {t("chat.addMemberButton")}
                </button>
              )}
              {(membership?.role === "owner" || membership?.role === "admin") && (
                <button
                  type="button"
                  className={`btn-secondary text-xs ${showAdminsOnly ? "bg-ink text-white" : ""}`}
                  onClick={() => setShowAdminsOnly((prev) => !prev)}
                >
                  {t("chat.adminsOnly")}
                </button>
              )}
            </div>

            {canInvite && showInvite && (
              <div className="mt-4">
                <label className="text-sm font-medium text-ink">{t("chat.addMember")}</label>
                <input
                  value={memberSearch}
                  onChange={(event) => setMemberSearch(event.target.value)}
                  placeholder={t("chat.searchUsers")}
                  className="input mt-2"
                />
                {memberSearch.trim().length > 1 && (
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-haze">
                    {(Array.isArray(searchUsersQuery.data)
                      ? searchUsersQuery.data
                      : searchUsersQuery.data?.results || []
                    )
                      .filter((result) => !memberIds.has(result.id))
                      .map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() => addMemberMutation.mutate(result.id)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-haze/60"
                        >
                          <span className="font-semibold text-ink">{result.username}</span>
                          <span className="text-xs text-ink/50">{t("chat.invite")}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
              {visibleMembers.map((member) => (
                <div
                  key={member.id}
                  className="group flex items-center justify-between rounded-xl border border-haze px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{member.username}</p>
                    <p className="text-xs text-ink/50">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none">
                    {canManageAdmins && member.role !== "owner" && (
                      <>
                        <button
                          type="button"
                          className="text-xs text-ink/60 hover:text-ink"
                          onClick={() => {
                            setEditingAdminId(member.id);
                            setAdminPermissions({
                              can_delete_messages: member.can_delete_messages,
                              can_kick: member.can_kick,
                              can_invite: member.can_invite,
                            });
                          }}
                        >
                          {t("chat.setAdmin")}
                        </button>
                        <button
                          type="button"
                          className="text-xs text-ink/60 hover:text-ink"
                          onClick={() => setAdminMutation.mutate({ userId: member.id, isFull: true })}
                        >
                          {t("chat.fullAdmin")}
                        </button>
                        {isOwner && member.role === "admin" && (
                          <button
                            type="button"
                            className="text-xs text-ink/60 hover:text-ink"
                            onClick={() => setAdminMutation.mutate({ userId: member.id, removeAdmin: true })}
                          >
                            {t("chat.removeAdmin")}
                          </button>
                        )}
                      </>
                    )}
                    {canKick && member.role !== "owner" && (
                      <button
                        type="button"
                        className="text-xs text-red-600 hover:text-red-700"
                        onClick={() => kickMemberMutation.mutate(member.id)}
                      >
                        {t("chat.kick")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editingAdminId && (
              <div className="mt-4 rounded-xl border border-haze p-3">
                <p className="text-sm font-semibold text-ink">{t("chat.adminPermissions")}</p>
                <div className="mt-2 space-y-2 text-sm text-ink/70">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={adminPermissions.can_delete_messages}
                      onChange={(event) =>
                        setAdminPermissions((prev) => ({
                          ...prev,
                          can_delete_messages: event.target.checked,
                        }))
                      }
                    />
                    {t("chat.permissionDelete")}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={adminPermissions.can_kick}
                      onChange={(event) =>
                        setAdminPermissions((prev) => ({
                          ...prev,
                          can_kick: event.target.checked,
                        }))
                      }
                    />
                    {t("chat.permissionKick")}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={adminPermissions.can_invite}
                      onChange={(event) =>
                        setAdminPermissions((prev) => ({
                          ...prev,
                          can_invite: event.target.checked,
                        }))
                      }
                    />
                    {t("chat.permissionInvite")}
                  </label>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={() => setEditingAdminId(null)}
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="button"
                    className="btn-primary text-sm"
                    onClick={() => setAdminMutation.mutate({ userId: editingAdminId, isFull: false })}
                  >
                    {t("common.saveChanges")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = Number(params.id);
  const { apiFetch, user } = useAuth();
  const { t } = useLanguage();

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

  return <ChatRoomContent roomId={roomId} user={user} apiFetch={apiFetch} />;
}

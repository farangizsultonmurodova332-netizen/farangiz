"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";
import type { ChatRoom } from "../lib/types";

interface ChatButtonProps {
  userId: number;
  username: string;
  className?: string;
}

export default function ChatButton({ userId, username, className = "" }: ChatButtonProps) {
  const router = useRouter();
  const { apiFetch, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createRoomMutation = useMutation({
    mutationFn: () =>
      apiFetch<ChatRoom>("/chat/rooms/get-or-create/", {
        method: "POST",
        body: JSON.stringify({ other_user_id: userId }),
      }),
    onSuccess: (data) => {
      router.push(`/chat/${data.id}`);
    },
    onError: (error) => {
      alert(`Error: ${(error as Error).message}`);
    },
  });

  const handleClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsLoading(true);
    createRoomMutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !user || user.id === userId}
      className={`btn ${className}`}
    >
      {isLoading ? "..." : "💬 Message"}
    </button>
  );
}

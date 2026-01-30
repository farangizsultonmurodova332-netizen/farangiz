export type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  birth_date?: string | null;
  phone?: string | null;
  location?: string | null;
  portfolio_url?: string | null;
  followers_count?: number;
  following_count?: number;
  total_ideas?: number;
  total_likes_received?: number;
  is_following?: boolean;
  reputation?: number;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_active?: boolean;
  first_name?: string;
  last_name?: string;
  last_login?: string | null;
  date_joined?: string;
};

export type Idea = {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  author: { id: number; username: string; is_following?: boolean };
  comment_count: number;
  like_count: number;
  user_liked: boolean;
};

export type Comment = {
  id: number;
  idea?: number;
  idea_detail?: { id: number; title: string };
  author: { id: number; username: string; avatar_url?: string };
  parent?: number | null;
  body: string;
  image_url?: string | null;
  is_pinned?: boolean;
  created_at: string;
  like_count?: number;
  user_liked?: boolean;
};

export type Notification = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  idea: number | null;
  notification_type: string;
  actor: { id: number; username: string } | null;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ChatMessage = {
  id: number;
  room: number;
  sender: number;
  sender_username: string;
  sender_id: number;
  reply_to?: number | null;
  reply_to_preview?: {
    id: number;
    sender_id: number;
    sender_username: string;
    body: string;
    is_deleted?: boolean;
  } | null;
  body: string;
  image_url?: string | null;
  audio_url?: string | null;
  created_at: string;
  updated_at?: string;
  is_read: boolean;
  is_deleted?: boolean;
  is_edited?: boolean;
  message_type?: 'text' | 'image' | 'audio' | 'file' | 'call' | 'system';
};

// Call types
export type CallType = 'voice' | 'video';
export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connecting' | 'connected' | 'ended' | 'rejected' | 'missed' | 'busy' | 'failed';

export type CallParticipant = {
  id: number;
  username: string;
  avatar_url?: string | null;
};

export type Call = {
  id: string;
  room_id: number;
  caller: CallParticipant;
  callee: CallParticipant;
  call_type: CallType;
  status: CallStatus;
  agora_channel?: string;
  agora_token?: string;
  started_at?: string;
  ended_at?: string;
  duration?: number;
};

export type CallSignal = {
  type: 'call_offer' | 'call_answer' | 'call_reject' | 'call_end';
  call_id: string;
  room_id: number;
  caller_id: number;
  caller_username?: string;
  caller_avatar?: string | null;
  callee_id: number;
  call_type: CallType;
  agora_channel?: string;
  agora_token?: string;
  reason?: string;
  duration?: number;
};

export type ChatRoom = {
  id: number;
  participants: number[];
  created_at: string;
  updated_at: string;
  is_group?: boolean;
  name?: string;
  description?: string;
  is_private?: boolean;
  created_by?: number | null;
  avatar_url?: string | null;
  member_count?: number;
  membership?: {
    role: string;
    can_delete_messages: boolean;
    can_kick: boolean;
    can_invite: boolean;
    can_manage_admins: boolean;
  } | null;
  last_message: {
    body: string;
    sender: string;
    created_at: string;
  } | null;
  other_user: {
    id: number;
    username: string;
    avatar_url?: string | null;
    is_online?: boolean;
    last_seen?: string | null;
  } | null;
  unread_count: number;
};

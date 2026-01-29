-- Chat app migrations
-- Run this SQL in your PostgreSQL database

-- Create chat_chatroom table
CREATE TABLE IF NOT EXISTS chat_chatroom (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create chat_chatroom_participants junction table
CREATE TABLE IF NOT EXISTS chat_chatroom_participants (
    id BIGSERIAL PRIMARY KEY,
    chatroom_id BIGINT NOT NULL REFERENCES chat_chatroom(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES accounts_user(id) ON DELETE CASCADE,
    UNIQUE(chatroom_id, user_id)
);

-- Create chat_message table
CREATE TABLE IF NOT EXISTS chat_message (
    id BIGSERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    room_id BIGINT NOT NULL REFERENCES chat_chatroom(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES accounts_user(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS chat_chatroom_updated_at_idx ON chat_chatroom(updated_at DESC);
CREATE INDEX IF NOT EXISTS chat_message_created_at_idx ON chat_message(created_at);
CREATE INDEX IF NOT EXISTS chat_message_is_read_idx ON chat_message(is_read);
CREATE INDEX IF NOT EXISTS chat_message_room_created_idx ON chat_message(room_id, created_at);
CREATE INDEX IF NOT EXISTS chat_message_room_read_idx ON chat_message(room_id, is_read);

-- Record migration in django_migrations table
INSERT INTO django_migrations (app, name, applied)
VALUES ('chat', '0001_initial', NOW())
ON CONFLICT DO NOTHING;

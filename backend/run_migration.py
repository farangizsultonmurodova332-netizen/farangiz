"""
Run chat migrations directly without Django management commands
"""
import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection parameters
DB_NAME = os.getenv('POSTGRES_DB', 'crowdbank')
DB_USER = os.getenv('POSTGRES_USER', 'crowdbank')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'crowdbank')
DB_HOST = os.getenv('POSTGRES_HOST', 'localhost')
DB_PORT = os.getenv('POSTGRES_PORT', '5432')

# SQL migration
SQL = """
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

-- Record migration
INSERT INTO django_migrations (app, name, applied)
VALUES ('chat', '0001_initial', NOW())
ON CONFLICT DO NOTHING;
"""

def main():
    try:
        # Connect to database
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )

        # Create cursor
        cur = conn.cursor()

        # Execute SQL
        print("Running chat migrations...")
        cur.execute(SQL)

        # Commit changes
        conn.commit()

        print("✅ Chat migrations completed successfully!")
        print("Tables created:")
        print("  - chat_chatroom")
        print("  - chat_chatroom_participants")
        print("  - chat_message")
        print("  - Indexes created")

        # Close cursor and connection
        cur.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error running migrations: {e}")
        return 1

    return 0

if __name__ == '__main__':
    exit(main())

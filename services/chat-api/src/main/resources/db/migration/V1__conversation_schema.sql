CREATE TABLE conversation (
    id          UUID PRIMARY KEY,
    user_id     VARCHAR(100) NOT NULL,
    title       VARCHAR(200) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL
);

CREATE TABLE message (
    id               UUID PRIMARY KEY,
    conversation_id  UUID NOT NULL REFERENCES conversation (id) ON DELETE CASCADE,
    role             VARCHAR(20) NOT NULL,
    content          TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_conversation_user_id ON conversation (user_id);
CREATE INDEX idx_message_conversation_id ON message (conversation_id);

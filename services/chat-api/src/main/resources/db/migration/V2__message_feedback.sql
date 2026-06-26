CREATE TABLE message_feedback (
    id               UUID PRIMARY KEY,
    message_id       UUID NOT NULL REFERENCES message (id) ON DELETE CASCADE,
    conversation_id  UUID NOT NULL REFERENCES conversation (id) ON DELETE CASCADE,
    user_id          VARCHAR(100) NOT NULL,
    feedback_type    VARCHAR(20) NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL,
    deleted          BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX uq_message_feedback_active
    ON message_feedback (message_id, user_id)
    WHERE deleted = FALSE;

CREATE INDEX idx_message_feedback_message_id ON message_feedback (message_id);

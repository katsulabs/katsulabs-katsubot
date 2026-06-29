-- P5-C: Gateway UUID conversation_id — Hyobee chat_viewable_teams.conversations integer[] → text[]
ALTER TABLE chat_viewable_teams
  ALTER COLUMN conversations DROP DEFAULT,
  ALTER COLUMN conversations TYPE text[]
  USING conversations::text[],
  ALTER COLUMN conversations SET DEFAULT '{}'::text[];

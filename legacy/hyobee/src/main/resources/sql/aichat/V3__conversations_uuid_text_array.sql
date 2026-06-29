ALTER TABLE chat_viewable_teams
  ALTER COLUMN conversations TYPE text[]
  USING CASE
    WHEN conversations IS NULL THEN NULL
    ELSE ARRAY(SELECT x::text FROM unnest(conversations) AS x)
  END;

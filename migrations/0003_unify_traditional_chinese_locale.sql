-- Public locale paths have one neutral written Traditional-Chinese edition.
-- Keep historical rows, but replace their former regional locale values.
CREATE TABLE waitlist_entries_next (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL CHECK (locale IN ('zh-Hant', 'zh-Hans', 'en')),
  interest TEXT NOT NULL,
  consent_at TEXT NOT NULL,
  source_path TEXT NOT NULL,
  created_at TEXT NOT NULL
);

INSERT INTO waitlist_entries_next (id, email, locale, interest, consent_at, source_path, created_at)
SELECT id, email,
  CASE WHEN locale IN ('zh-HK', 'zh-TW', 'zh-MO') THEN 'zh-Hant' ELSE locale END,
  interest, consent_at, source_path, created_at
FROM waitlist_entries;

DROP TABLE waitlist_entries;
ALTER TABLE waitlist_entries_next RENAME TO waitlist_entries;
CREATE INDEX idx_waitlist_created_at ON waitlist_entries(created_at);

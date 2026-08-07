CREATE TYPE issue_status AS ENUM ('todo', 'done');

CREATE TABLE epics (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status issue_status NOT NULL DEFAULT 'todo',
  epic_id INTEGER REFERENCES epics(id) ON DELETE RESTRICT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

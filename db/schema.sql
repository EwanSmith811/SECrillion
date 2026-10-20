-- SECrillion schema for Neon Postgres. Apply with `npm run migrate` (or paste into the Neon SQL editor).

-- One row per (prompt, canonical answer); n is how many divers have given it.
-- Pooled across every dive that uses the prompt. Raw text players type is never stored.
create table if not exists answer_counts (
  prompt_id  text not null check (char_length(prompt_id) <= 60),
  answer     text not null check (char_length(answer) <= 120),
  n          integer not null default 0,
  primary key (prompt_id, answer)
);

create table if not exists scores (
  id          bigint generated always as identity primary key,
  dive_key    text not null check (char_length(dive_key) <= 40),
  score       integer not null check (score between 0 and 700),
  name        text check (char_length(name) <= 20),
  created_at  timestamptz not null default now()
);

create index if not exists scores_dive_idx on scores (dive_key);

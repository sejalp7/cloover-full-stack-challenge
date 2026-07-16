CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS quotes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  monthly_consumption_kwh NUMERIC NOT NULL,
  system_size_kw NUMERIC NOT NULL,
  down_payment NUMERIC,
  system_price NUMERIC NOT NULL,
  principal NUMERIC NOT NULL,
  risk_band TEXT NOT NULL CHECK (risk_band IN ('A', 'B', 'C')),
  offers JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX quotes_user_id_idx ON quotes(user_id);

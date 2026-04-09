-- Migration: 003_create_transactions_table.sql
-- Creates the transactions table. Negative amounts = expense, positive = income.
-- receipt_url is nullable (NULLIF used on insert).

CREATE TABLE IF NOT EXISTS transactions (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id      UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    amount           NUMERIC(15, 2) NOT NULL,
    currency         VARCHAR(10) NOT NULL DEFAULT 'IDR',
    description      TEXT NOT NULL,
    receipt_url      TEXT,
    transaction_date DATE NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date    ON transactions (user_id, transaction_date DESC);

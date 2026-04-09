-- Migration: 002_create_categories_table.sql
-- Creates the categories table for income/expense classification per user.

CREATE TABLE IF NOT EXISTS categories (
    id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name    VARCHAR(100) NOT NULL,
    type    VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense'))
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories (user_id);

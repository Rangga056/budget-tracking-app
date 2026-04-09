-- Migration: 001_create_users_table.sql
-- Creates the users table with email verification and password reset support.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username                VARCHAR(50) UNIQUE,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    password_hash           TEXT NOT NULL,
    email_verified          BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token      TEXT,
    reset_password_token    TEXT,
    reset_password_expires  TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email    ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_username ON users (LOWER(username));

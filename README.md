# 💰 Budget Tracking App

A professional, full-stack financial management solution.

## 🏗 Architecture Overview

- **Backend (`/backend`)**: Go (Fiber v3) REST API.
- **Frontend (`/client`)**: Next.js 15 (App Router) + TypeScript.

## 🛡 Security Standards

- **JWT-only Cookies**: Authentication tokens are stored in `HttpOnly` cookies.
- **Environment Isolation**: No secrets committed (enforced via pre-commit hooks).

## 🚀 Quick Start

1. `docker-compose up -d`
2. `cd backend && go run cmd/api/main.go`
3. `cd client && npm run dev`

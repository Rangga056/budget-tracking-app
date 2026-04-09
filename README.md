# BudgetFlow 💸

BudgetFlow is a modern, offline-first Progressive Web Application (PWA) designed to help you track your financial life with clarity and precision. Built with a robust Go backend and a highly responsive Next.js frontend, BudgetFlow ensures your finances are always available—even when your internet isn't.

> **Note on Imagery**: We rely on your contributions! Please submit screenshots of your build to the `docs/images/` directory to share the beautiful UI.

## ✨ Features

- **Offline-First Architecture**: Powered by IndexedDB (Dexie.js), so you can log expenses without an internet connection.
- **Smart Synchronization**: Edits are queued locally and automatically pushed to the cloud once you regain network connectivity.
- **Comprehensive Dashboard**: View intuitive pie charts, line charts, and rapid insights into your income versus expenses.
- **Robust Security**: Utilizes HTTPOnly cookies for JSON Web Token (JWT) storage to prevent XSS attacks.
- **Complete Authentication**: Register, Login, Verify Email, and recover your password securely.
- **Sleek Interface**: Features a glassmorphic design system ("Architectural Ledger") with smooth gradients and a minimalist aesthetic.

---

## 📸 Screenshots

| Login | Dashboard | Transactions |
| :---: | :---: | :---: |
| ![Login Page](docs/images/login.png) | ![Dashboard](docs/images/dashboard.png) | ![Transactions](docs/images/transactions.png) |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: `Next.js 16` (App Router)
- **Language**: `TypeScript`
- **State Management / Forms**: `@tanstack/react-form`, `Zod` (validation)
- **Styling**: `Material UI (MUI v7)`, `TailwindCSS`
- **Offline Storage**: `Dexie.js` (IndexedDBwrapper) 
- **Charts**: `Recharts`

### Backend
- **Framework**: `Go Fiber` (Golang)
- **Database**: `PostgreSQL 16` (using `pgx`)
- **Authentication**: `JWT`, `bcrypt`
- **Documentation**: `Swagger` (swaggo/swag)

---

## 🚀 Quick Start Guide

### Prerequisites
- [Go 1.22+](https://go.dev/)
- [PostgreSQL 16+](https://postgresql.org/)
- [Bun](https://bun.sh/) (or NPM)

### 1. Database Setup
Create your PostgreSQL database:
```sql
CREATE DATABASE budget_tracking_app;
\c budget_tracking_app

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Use the provided SQL commands in your DB setup phase to create the remaining tables.
```

### 2. Backend Setup
Navigate to the `backend` directory, set up your `.env` file, and start the Fiber API:
```bash
cd backend
cp .env.example .env  # Update DATABASE_URL and JWT_SECRET
go mod tidy
go run cmd/api/main.go
```
The API will be running on `http://localhost:8000`.

### 3. Frontend Setup
Navigate to the `client` directory, install dependencies, and start the Next.js development server:
```bash
cd client
bun install
bun run dev
```
The Web App will be running on `http://localhost:3000`.

---

## 📖 API Documentation

This project uses **Swagger** to document the REST endpoints. You can access the UI by visiting:

👉 `http://localhost:8000/swagger`

To regenerate the documentation after updating handlers, run:
```bash
cd backend
swag init -d internal/handlers,cmd/api -o docs
```

---

## 🔐 Authentication Flow
- **Register**: Provide a username, email, and password. A verification token is generated.
- **Verify**: Confirm your email using the token to unlock your account.
- **Login**: Access your account seamlessly with either your username or email address.
- **Recovery**: Lost your password? Trigger a secure reset link to regain access.

### License
MIT License.

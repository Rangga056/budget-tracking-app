# ⚙️ Budget Tracker Backend

High-performance REST API powering the Budget Tracking ecosystem. Built with Go and the Fiber v3 web framework.

## 🚀 Features

- **JWT Authentication**: Secure login/register flow using `HttpOnly` cookies.
- **PostgreSQL Integration**: Efficient connection pooling using `pgxpool`.
- **Auto-generated Documentation**: Interactive Swagger UI for API testing.
- **Middleware-first Architecture**: Built-in request logging, CORS, and auth protection.

## 🛠 Tech Stack

- **Framework**: [Fiber v3](https://docs.gofiber.io/)
- **Database**: PostgreSQL 16
- **Driver**: [pgx/v5](https://github.com/jackc/pgx)
- **Security**: JWT-Go, Bcrypt
- **Docs**: Swaggo (OpenAPI)

## 📁 Directory Structure

```text
internal/
├── config/     # Database and Env initialization
├── handlers/   # Business logic / Controllers
├── middleware/ # Auth and Security layers
├── models/     # Data structures and Types
└── repository/ # Database abstraction layer (Coming Soon)
cmd/api/        # Application entry point
```

## 🛰 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Create a new account | No |
| `POST` | `/api/login` | Authenticate & get cookie | No |
| `POST` | `/api/logout` | Clear auth cookie | No |
| `GET` | `/api/me` | Get current user info | **Yes** |
| `GET` | `/health` | System status check | No |

## 📖 API Documentation

Once the server is running, visit:
`http://localhost:8000/swagger`

## 🛠 Development

### Run in watch mode (requires Air)
```bash
air
```

### Build for production
```bash
go build -o bin/api cmd/api/main.go
```

# Stage 1: Build the Go application
FROM golang:alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum from backend folder
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application
COPY . .

# Build the Go application
# Assuming main.go is in cmd/api/main.go
RUN go build -o main ./cmd/api/main.go

# Stage 2: Final minimal image
FROM alpine:latest

# Install necessary libraries (like ca-certificates if your app uses https)
RUN apk --no-cache add ca-certificates libc6-compat

WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /app/main .

# Copy documentation if needed
COPY --from=builder /app/docs ./docs

# Expose the application port
EXPOSE 8000

# Run the binary
CMD ["./main"]

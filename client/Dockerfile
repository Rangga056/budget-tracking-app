# Stage 1: Build the Next.js application
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
# Standalone mode must be enabled in next.config.ts
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# Stage 2: Production image
FROM node:24-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the application port
EXPOSE 3000

# Set environment variable for the port (Next standalone defaults to 3000)
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the server
CMD ["node", "server.js"]

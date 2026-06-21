# ---- Stage 1: Dependencies ----
FROM node:22-alpine AS deps

# Enable corepack for pnpm
RUN corepack enable
RUN corepack enable pnpm

WORKDIR /app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ---- Stage 2: Builder ----
FROM node:22-alpine AS builder

RUN corepack enable
RUN corepack enable pnpm

WORKDIR /app

#set env ci to true 
ENV CI=true

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy source code
COPY . .

# Set build-time env vars
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_Jk8D7o7g43Xz59iE1wVnCjC2vB396F9G1yH9E4J7z9"
ENV NEXT_PUBLIC_API_URL="http://backend:8080"

# Build the Next.js application
RUN pnpm build

# ---- Stage 3: Runtime ----
FROM node:22-alpine AS runtime

WORKDIR /app

# Copy standalone build output from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Create non-root user
RUN adduser -D appuser

# Switch to non-root user
USER appuser

# Start Next.js server
CMD ["node", "server.js"]

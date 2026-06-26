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

# Set build-time env vars via ARGs (NEXT_PUBLIC_ vars are inlined at build time)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

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

# backend/Dockerfile — Multi-stage Rust build for backend
#Entrypoint script runs diesel migrations at startup

# ---- Stage 1: Builder ----
FROM rust:1.91.1-bookworm AS builder

WORKDIR /app

# ── Dependency caching layer ──────────────────────────────────
# Copy only the Cargo manifests (workspace + each member)
COPY Cargo.toml Cargo.lock ./
COPY backend/Cargo.toml backend/Cargo.toml
COPY worker/Cargo.toml worker/Cargo.toml
COPY shared/Cargo.toml shared/Cargo.toml
COPY tests/Cargo.toml tests/Cargo.toml

# Create dummy/stub source files so `cargo build` can resolve
# the workspace and compile all *dependencies* without real code
RUN mkdir -p backend/src worker/src shared/src tests/src \
    && echo "fn main() {}" > backend/src/main.rs \
    && echo "fn main() {}" > worker/src/main.rs \
    && echo "" > shared/src/lib.rs \
    && echo "" > tests/src/lib.rs

# Build all dependencies (this layer is cached until Cargo.toml/lock change)
RUN cargo build --release -p backend

# Remove the dummy source files and compiled stubs (keep dep artifacts)
RUN rm -rf backend/src worker/src shared/src tests/src

# ── Real source build ─────────────────────────────────────────
# Copy the actual source code
COPY backend/ backend/
COPY shared/ shared/
COPY worker/ worker/
COPY tests/ tests/

# Touch the source files so Cargo knows they're newer than the stubs
RUN touch backend/src/main.rs shared/src/lib.rs

# Build the real backend binary (only your code recompiles, deps are cached)
RUN cargo build --release -p backend

# Install diesel_cli (only with postgres feature, keeps it lighter)
RUN cargo install diesel_cli --no-default-features --features postgres

# ---- Stage 2: Runtime ----
FROM debian:bookworm-slim AS runtime

# Install runtime dependencies:
#   - libpq5: required by Diesel + diesel_cli for PostgreSQL connections
#   - ca-certificates: required for TLS (Clerk JWKS fetching, HTTPS calls)
RUN apt-get update && apt-get install -y --no-install-recommends \
  libpq5 \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the compiled backend binary from builder
COPY --from=builder /app/target/release/backend ./backend

# Copy diesel_cli binary from builder (for running migrations at startup)
COPY --from=builder /usr/local/cargo/bin/diesel /usr/local/bin/diesel

# Copy migrations directory (for diesel migration run at startup)
COPY backend/migrations/ ./migrations/

# Copy diesel.toml (diesel_cli config)
COPY backend/diesel.toml ./diesel.toml

# Create non-root user for security
# (adds defense-in-depth inside the container)
RUN useradd --create-home --shell /bin/bash appuser

# Copy the entrypoint script and make it executable
COPY backend/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Switch to non-root user
USER appuser

# Expose the actix-web port
EXPOSE 8080

# Use entrypoint script to run migrations then start the server
ENTRYPOINT ["./entrypoint.sh"]

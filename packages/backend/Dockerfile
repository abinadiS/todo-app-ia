# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM oven/bun:1.1 AS deps

WORKDIR /app

# Copy root package files
COPY package.json bun.lockb* ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# ==========================================
# Stage 2: Build
# ==========================================
FROM oven/bun:1.1 AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/backend/node_modules ./packages/backend/node_modules 2>/dev/null || true
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules 2>/dev/null || true

# Copy source code
COPY . .

# Generate Prisma client
RUN cd prisma && bunx prisma generate

# ==========================================
# Stage 3: Production
# ==========================================
FROM oven/bun:1.1-slim AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 bunjs

# Copy necessary files
COPY --from=builder /app/packages/backend/src ./src
COPY --from=builder /app/packages/shared/src ./packages/shared/src
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/packages/backend/package.json ./package.json

# Set ownership
RUN chown -R bunjs:nodejs /app

USER bunjs

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --eval "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1))" || exit 1

CMD ["bun", "run", "src/index.ts"]

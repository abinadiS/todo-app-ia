# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM oven/bun:1.1 AS deps

WORKDIR /app

# Copy root package files
COPY package.json bun.lockb* ./
COPY packages/frontend/package.json ./packages/frontend/
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
COPY --from=deps /app/packages/frontend/node_modules ./packages/frontend/node_modules 2>/dev/null || true
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules 2>/dev/null || true

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Build the frontend
RUN bun run --cwd packages/frontend build

# ==========================================
# Stage 3: Production (nginx)
# ==========================================
FROM nginx:alpine AS production

# Copy custom nginx config
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

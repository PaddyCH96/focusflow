FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy application source
COPY . . --chown=node:node
ENV NEXT_TELEMETRY_DISABLED=1
# Set git commit hash for cache busting
RUN git rev-parse HEAD > /tmp/build-hash 2>/dev/null || true
# Add git commit to environment for build timestamping
RUN echo "NEXT_PUBLIC_GIT_HASH=$(git rev-parse HEAD 2>/dev/null || echo 'unknown')" >> /tmp/build-env && cat /tmp/build-env >> .env.production.local
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create standard next.js user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set correct permissions for nextjs user
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

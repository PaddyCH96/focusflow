FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy application source with cache busting using git commit hash
COPY . . --chown=node:node
ENV NEXT_TELEMETRY_DISABLED=1
# Add git commit hash to package.json to trigger rebuild when source changes
RUN git rev-parse HEAD > /app/.git-hash 2>/dev/null || true && npm run build

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

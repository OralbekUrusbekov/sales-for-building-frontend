# RemontHub frontend — Next.js, built standalone for a small production image.
#
# Build-time args (baked into the client bundle, so they must be set at build,
# not just at container runtime):
#   NEXT_PUBLIC_API_URL  – e.g. https://dev.nbs.narxoz.kz/building/api
#   NEXT_BASE_PATH        – e.g. /building (empty for domain-root deployments)

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ARG NEXT_BASE_PATH=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_BASE_PATH=$NEXT_BASE_PATH
ENV DOCKER_BUILD=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

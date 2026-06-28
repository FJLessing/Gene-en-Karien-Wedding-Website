# ---- build ----
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build            # nuxt build → .output/ (node-server preset)

# ---- runtime ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
ENV PORT=8080
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]

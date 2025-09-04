FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++ bash

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# ----------------------------
# Runtime stage (nhẹ)
# ----------------------------
FROM node:22-alpine AS runner
WORKDIR /app

# Copy standalone build, node_modules production đã build sẵn
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
ENV PORT=3001
EXPOSE 3001
CMD ["node", "server.js"]

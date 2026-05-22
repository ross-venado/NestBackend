FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

EXPOSE 5000

CMD ["node", "dist/main"]

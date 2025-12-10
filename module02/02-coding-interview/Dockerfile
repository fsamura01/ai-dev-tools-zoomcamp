# Stage 1: Build Client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package.json ./
RUN npm install
COPY client/ ./
# Build (tsc + vite build)
RUN npm run build

# Stage 2: Build Server
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Production Runner
FROM node:18-alpine
WORKDIR /app

# Install production dependencies for server
COPY server/package.json ./
RUN npm install --production

# Copy server build
COPY --from=server-build /app/server/dist ./dist

# Copy client build to /app/client/dist so that server logic (../../client/dist) finds it from /app/dist
# /app/dist/../../client/dist -> /app/client/dist
COPY --from=client-build /app/client/dist ./client/dist

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]

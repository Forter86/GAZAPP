# Stage 1: Build the frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including vite/build tools)
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Run the server
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy built frontend from stage 1
COPY --from=builder /app/dist ./dist
# Copy public folder for templates
COPY --from=builder /app/public ./public
# Copy server code
COPY server.cjs .

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server.cjs"]

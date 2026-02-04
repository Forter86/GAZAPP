# Simple Node.js hosting (Expects 'dist', 'server.js', 'package.json' to be uploaded manually)
FROM node:18-alpine

WORKDIR /app

# Copy package files (Required for server dependencies)
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy server code
COPY server.cjs .

# Copy pre-built frontend (You must upload 'dist' folder to server!)
COPY dist ./dist
COPY public ./public

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server.cjs"]

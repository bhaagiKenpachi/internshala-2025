# Use Node.js 20 as base (to avoid engine warnings)
FROM node:20-alpine

# Install Python and build tools for native dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Install dependencies (including dev dependencies for TypeScript compilation)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Install dev dependencies for build
RUN npm install --only=dev

# Build TypeScript to JavaScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose backend port
EXPOSE 4000

# Set environment variables (override in docker-compose or at runtime)
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "dist/index.js"]
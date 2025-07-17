# Use Node.js LTS as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose backend port
EXPOSE 4000

# Set environment variables (override in docker-compose or at runtime)
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "dist/index.js"]
# Node.js base image
FROM node:16-alpine as base

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Build client
RUN npm run build

# Production image
FROM node:16-alpine

WORKDIR /app

# Copy from build stage
COPY --from=base /app/package*.json ./
COPY --from=base /app/server ./server
COPY --from=base /app/client/build ./client/build

# Install production dependencies only
RUN npm install --only=production
RUN cd server && npm install --only=production

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
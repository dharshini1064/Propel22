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

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
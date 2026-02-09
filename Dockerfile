# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments for environment variables
# These will be passed from docker-compose.yml
ARG VITE_API_URL
ARG VITE_APP_NAME
ARG NODE_ENV=production

# Set environment variables for the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV NODE_ENV=$NODE_ENV

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for tsc, vite)
RUN npm ci --include=dev

# Copy source code and .env file if it exists
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install serve globally to serve static files and curl for healthcheck
RUN npm install -g serve && \
    apk add --no-cache curl

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port  5173
EXPOSE 5173

# Start serve
CMD ["serve", "-s", "dist", "-l", "5173"]
 
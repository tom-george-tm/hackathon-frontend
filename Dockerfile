# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app


# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci


# Copy source code
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

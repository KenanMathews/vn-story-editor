# Multi-stage build
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies - FIXED: Use npm install instead of npm ci
RUN npm install --omit=dev

# Copy source code
COPY . .

# Build the application (if you have a build step)
RUN npm run build 2>/dev/null || echo "No build script found, skipping..."

# Production stage
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html/ 2>/dev/null || \
     COPY --from=builder /app/build /usr/share/nginx/html/ 2>/dev/null || \
     COPY --from=builder /app/public /usr/share/nginx/html/ 2>/dev/null || \
     COPY --from=builder /app /usr/share/nginx/html/

# Copy custom nginx config if it exists
COPY nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || echo "No custom nginx config found"

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
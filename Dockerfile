# Quantum AI - Docker Configuration
# Multi-stage build for optimized image size

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Setup Backend
FROM node:20-alpine AS backend-setup
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/ ./

# Stage 3: Final Production Image
FROM node:20-alpine
WORKDIR /app

# Install serve for frontend and cleanup tools
RUN npm install -g serve && \
    apk add --no-cache tini

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend

# Copy backend
COPY --from=backend-setup /app/backend ./backend

# Copy environment file
COPY backend/.env ./backend/.env

# Expose ports
EXPOSE 3001 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/backend && node server.js &' >> /app/start.sh && \
    echo 'cd /app/frontend && serve -s . -l 3000' >> /app/start.sh && \
    chmod +x /app/start.sh

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/bin/sh", "/app/start.sh"]

# ============================================
# STAGE 1: BUILD STAGE
# ============================================
# This stage compiles your React/Vite app into static files

FROM node:20-alpine AS builder

# Set working directory inside the container
# All subsequent commands will run from /app
WORKDIR /app

# Copy package.json and package-lock.json first
# WHY SEPARATE? Docker caches each step (layer). If package files
# don't change, Docker reuses cached npm install (saves minutes!)
COPY package*.json ./

# Install dependencies
# Using 'npm ci' instead of 'npm install' because:
# - 'ci' is faster (skips unnecessary checks)
# - 'ci' uses package-lock.json exactly (reproducible builds)
# - 'ci' is designed for automated environments
RUN npm ci

# Now copy the rest of the source code
# This happens AFTER npm ci so changing your code doesn't
# invalidate the npm install cache layer
COPY . .

# Declare build arguments - these will be passed at build time
# Vite needs these at BUILD TIME (not runtime) because it bakes them
# into the JavaScript bundle during compilation
ARG VITE_API_KEY
ARG VITE_OPENWEATHER_API_KEY

# Set as environment variables so Vite can read them during build
# Vite looks for process.env.VITE_* during the build process
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_OPENWEATHER_API_KEY=$VITE_OPENWEATHER_API_KEY

# Build the application
# This runs 'vite build' which:
# 1. Compiles React JSX to JavaScript
# 2. Bundles all modules together
# 3. Minifies code (removes whitespace, shortens variable names)
# 4. Optimizes assets (images, fonts)
# 5. Outputs everything to /app/dist folder
RUN npm run build

# ============================================
# STAGE 2: PRODUCTION STAGE
# ============================================
# This stage creates the final lightweight image

FROM nginx:alpine

# Install dumb-init for proper signal handling
# WHY? When Kubernetes wants to stop a container, it sends SIGTERM signal.
# nginx doesn't handle signals well when running as PID 1.
# dumb-init sits as PID 1 and properly forwards signals to nginx.
# This allows graceful shutdowns (nginx finishes current requests before stopping).
RUN apk add --no-cache dumb-init

# Create a non-root user for security
# WHY? Running as root inside containers is a security risk.
# If someone exploits nginx, they'd have root access.
# -g 1001: group ID 1001
# -S: create system group
# -u 1001: user ID 1001
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001

# Copy custom nginx configuration from host to container
# We'll create nginx.conf next - it tells nginx how to serve files
# --chown=nginx-app:nginx-app: makes nginx-app own the file (not root)
COPY --chown=nginx-app:nginx-app nginx.conf /etc/nginx/nginx.conf

# Copy the built application from the builder stage
# --from=builder: grab files from first stage (the node:20-alpine stage)
# /app/dist: where Vite outputs built files in builder stage
# /usr/share/nginx/html: where nginx expects to find files to serve
COPY --from=builder --chown=nginx-app:nginx-app /app/dist /usr/share/nginx/html

# Create necessary directories and set permissions
# nginx needs to write to these directories but they're root-owned by default
# mkdir -p: create directories if they don't exist
# chown -R: recursively change owner to nginx-app
# chmod -R 755: 
#   - 7 (owner): read+write+execute
#   - 5 (group): read+execute
#   - 5 (others): read+execute
RUN mkdir -p /var/cache/nginx /var/log/nginx /tmp && \
    chown -R nginx-app:nginx-app /var/cache/nginx /var/log/nginx /tmp /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /tmp /usr/share/nginx/html

# Switch to non-root user
# From this point on, all commands run as nginx-app (not root)
USER nginx-app

# Document that the container listens on port 8080
# This is informational - doesn't actually open the port
# Kubernetes will map this port to the cluster network
EXPOSE 8080

# Health check - Kubernetes uses this to know if container is healthy
# --interval=30s: check every 30 seconds
# --timeout=3s: if check takes >3s, consider it failed
# --start-period=5s: wait 5s after start before first check (app startup time)
# --retries=3: after 3 failed checks, mark container as unhealthy
# wget --quiet: don't print output
# --tries=1: only try once per health check
# --spider: don't download, just check if URL is reachable
# || exit 1: if wget fails, exit with code 1 (failure)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Use dumb-init as the entry point
# ENTRYPOINT sets the main process that runs when container starts
# -- means "pass following commands as arguments to dumb-init"
ENTRYPOINT ["dumb-init", "--"]

# Start nginx in foreground mode
# CMD is the default command (can be overridden when running container)
# -g: pass directive to nginx
# "daemon off;": run nginx in foreground (not as background daemon)
#   WHY? Docker needs the main process to stay in foreground
#   If nginx daemonizes, Docker thinks container exited and stops it
CMD ["nginx", "-g", "daemon off;"]

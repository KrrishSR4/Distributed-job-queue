# Stage 1: Build the Angular application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (using npm ci is preferred if package-lock.json exists, but npm install is a safe fallback)
RUN npm install

# Copy source code
COPY . .

# Build the Angular app for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built output from the builder stage to the Nginx HTML directory
# The output path from @angular/build:application is typically dist/<project-name>/browser
COPY --from=builder /app/dist/distributed-job-queue/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (needed for both build and tsconfig resolution)
RUN npm ci

# Copy source code
COPY . .

# Install dependencies again to ensure all are present
RUN npm ci

# Build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_LUCIDFLOW_ENQUIRY_ENDPOINT
ARG VITE_GA_MEASUREMENT_ID
ARG VITE_GA4_PROPERTY_ID
ARG VITE_ADMIN_EMAIL

# Set environment variables
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
ENV VITE_LUCIDFLOW_ENQUIRY_ENDPOINT=${VITE_LUCIDFLOW_ENQUIRY_ENDPOINT}
ENV VITE_GA_MEASUREMENT_ID=${VITE_GA_MEASUREMENT_ID}
ENV VITE_GA4_PROPERTY_ID=${VITE_GA4_PROPERTY_ID}
ENV VITE_ADMIN_EMAIL=${VITE_ADMIN_EMAIL}

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install a simple HTTP server to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]

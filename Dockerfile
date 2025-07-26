# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app


# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="haricorp"
ENV NEXT_PUBLIC_BACKEND_URL="https://2handstore.id.vn/api"

# Build the app
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy build artifacts from builder
COPY --from=builder /app ./

# Expose desired port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]

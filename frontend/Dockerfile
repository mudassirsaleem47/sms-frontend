# Frontend Dockerfile for React + Vite

# Use Node.js 20 Alpine (lightweight)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server
# --host 0.0.0.0 allows access from outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

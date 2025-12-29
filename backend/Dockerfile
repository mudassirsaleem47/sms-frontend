# Backend Dockerfile for Express + Node.js

# Use Node.js 20 Alpine (lightweight)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose backend port
EXPOSE 5000

# Start backend with nodemon for auto-restart
CMD ["npm", "run", "dev"]

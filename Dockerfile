# Use an official Node.js runtime as the base image
FROM node:18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the entire NestJS application source code to the working directory
COPY . .

# Build your NestJS application for production (adjust the build command as needed)
RUN npm run build

# Use a smaller image for production (e.g., an Alpine-based image)
FROM node:18-alpine

# Set the working directory in the final image
WORKDIR /app

# Copy only the built application files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose the port your NestJS application will listen on (change as needed)
EXPOSE 3500

# Command to start your NestJS application (adjust as needed)
CMD ["node", "dist/main.js"]

# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app/server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install server dependencies
RUN npm ci

# Copy the rest of the server code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV PORT=3000

# Command to start the server
# Make sure to set the DATABASE_URL environment variable when running the container
CMD ["node", "index.js"]
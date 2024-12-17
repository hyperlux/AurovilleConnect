# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app/server

# Copy the server directory
COPY server/ .

# List files to verify the contents
RUN ls -la

# Install server dependencies
RUN npm ci

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV PORT=3000

# Command to start the server
# Make sure to set the DATABASE_URL environment variable when running the container
CMD ["node", "index.js"]
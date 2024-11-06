# Use Node.js official image
FROM node:18-alpine AS dev

# Set working directory inside container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Install nodemon globally
RUN npm install -g nodemon

# Copy the source code to the container
COPY . .

# Expose port 5000 (default for Express)
EXPOSE 5000

# Run the backend server (e.g., Express)
CMD ["npm", "run", "dev"]

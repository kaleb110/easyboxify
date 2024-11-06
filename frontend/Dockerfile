# Use Node.js official image
FROM node:18-alpine AS dev

# Set working directory inside container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the source code to the container
COPY . .

# Expose port 3000 (default for Next.js)
EXPOSE 3000

# Run the development server (Next.js or React app)
CMD ["npm", "run", "dev"]

# Stage 1: Install dependencies (dev)
FROM node:18-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Copy source and build
FROM node:18-alpine
WORKDIR /app
COPY --from=dev /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

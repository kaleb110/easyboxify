FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Install nodemon for hot reloading
RUN npm install --only=dev nodemon

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

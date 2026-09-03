FROM node:20-alpine

WORKDIR /app

# Copy only package files first — this is the key Docker concept: layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Now copy the rest of the app
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
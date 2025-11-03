FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for Prisma and runtime
RUN apk add --no-cache bash openssl libc6-compat

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Remove dev dependencies
RUN npm prune --production

# Copy source code
COPY src ./src/

# Expose port
EXPOSE 5000

# Start server 
CMD ["npm", "start"]

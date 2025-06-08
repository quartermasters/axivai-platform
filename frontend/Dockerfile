FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S axivai -u 1001
USER axivai

# Expose port
EXPOSE 3000

# Default command
CMD ["npm", "start"]
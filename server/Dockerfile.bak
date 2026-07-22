FROM oven/bun:latest

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy backend source code
COPY . .

# Expose correct port
EXPOSE 3000

# Run production server
CMD ["bun", "run", "start"]

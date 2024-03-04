# Use node:18-alpine as the base image
FROM node:18-alpine

# Set the environment variable
ENV NODE_ENV production

# Set the working directory in the Docker container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# First copy package.json and pnpm-lock.yaml
# This is done before copying the entire project to cache the dependencies layer
COPY package.json pnpm-lock.yaml ./

# Run pnpm to install dependencies
# This layer will be cached and reused as long as package.json and pnpm-lock.yaml don't change
RUN pnpm install

# Copy the rest of the project files to the container
COPY . .

# Add any custom hosts entries (optional, and generally not recommended for production)
RUN echo "10.104.0.4 chatcenter.luckybox.co" >> /etc/hosts

RUN echo "NEXT_PUBLIC_APP_VERSION=1.0.0" >> .env
RUN echo "NEXT_PUBLIC_APP_BUILD_VERSION=ef98" >> .env

# Build the application
RUN pnpm run pre-build

# Change permissions for the .next directory (review if necessary for security)
RUN chmod 777 .next

# The command to run the application
CMD ["pnpm", "run", "production"]

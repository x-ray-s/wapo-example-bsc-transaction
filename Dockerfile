# Use the official Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

COPY .env ./
COPY index.html ./
COPY client ./client
COPY server ./server
COPY vite.config.js ./
COPY esbuild.js ./
COPY esbuild.raw.js ./

# Install dependencies
RUN npm install

RUN npm run build:preview

# Copy the rest of the application code
COPY dist ./

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
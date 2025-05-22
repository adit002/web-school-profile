# Base image for development
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project (except files in .dockerignore)
COPY . .

# Expose Vite's development server port (default is 5173)
EXPOSE 5173

# Start the Vite development server and listen on all interfaces
CMD ["npm", "run", "dev", "--", "--host"]

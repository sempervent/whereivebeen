# Use an official Node runtime as a base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client application
COPY . .

# Build the project for production
RUN npm run build

# Install serve to serve the build folder
RUN npm install -g serve

# Expose port 5000 where serve runs the application
EXPOSE 5000

# Run serve to dish out the build directory
CMD ["serve", "-s", "build", "-l", "5000"]

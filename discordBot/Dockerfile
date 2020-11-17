# Create image based on the official Node 6 image from the dockerhub
FROM node:12

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app
# Copy dependency definitions
COPY package*.json ./
# Install dependecies
RUN npm install
# Get all the code needed to run the app
COPY . .
# Expose the port the app runs in
EXPOSE 1337

# Serve the app
CMD ["npm", "start"]

# Create image based on the official Node image from dockerhub
FROM node:12

# Change directory so that our commands run inside this new directory
WORKDIR /client
# Copy dependency definitions
COPY package*.json ./

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

RUN chmod u+x  ./build.sh

# Dev server
EXPOSE 4200
# Test runner server
EXPOSE 9876

CMD [ "sh", "./build.sh"]

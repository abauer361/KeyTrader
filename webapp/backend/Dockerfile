# Create image based on the official Node 12 image from the dockerhub
FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Main port
EXPOSE 3000
# Debugging port
EXPOSE 9229

CMD [ "npm", "start"]

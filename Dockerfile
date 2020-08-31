# Base image
FROM node:lts

LABEL maintainer 'Frank Lacroix <lacroixDj@gmail.com>'

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# installing dependencies 
RUN npm install

# Bundle app source
COPY . .

# running tests
CMD [ "npm", "test" ]
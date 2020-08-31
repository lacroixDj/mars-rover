# Base image
FROM node:lts

LABEL maintainer 'Frank Lacroix <lacroixDj@gmail.com>'

# Create app directory
WORKDIR /home/node/app

# Installing forever
RUN npm install pm2@latest -g

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# installing dependencies 
RUN npm install

# Bundle app source
COPY . .


# Starting daemonized app
CMD [ "nohup", "pm2", "start", 'npm', '--', 'start' ]
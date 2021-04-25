FROM node:14-buster-slim

# Create app directory
WORKDIR /usr/src/app

# Bundle APP files
COPY src src/
COPY config config
COPY package.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# Expose the listening port of your app
EXPOSE 8000

CMD [ "npm", "start" ]

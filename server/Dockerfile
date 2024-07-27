#  Dockerfile for Node Express Backend api (development)

FROM node:14.15.3-alpine3.12

ARG NODE_ENV=development

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install
#RUN npm install --save nodemon

# Copy app source code
COPY . .
RUN chmod +x ./start.sh

# Exports
EXPOSE 5000

#CMD ["npm","start"]
CMD [".", "./start.sh"]

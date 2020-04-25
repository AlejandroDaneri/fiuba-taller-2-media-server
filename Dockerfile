FROM node:13-alpine

RUN mkdir -p /src/app

WORKDIR /src/app

RUN npm install

CMD [ "npm", "start" ]
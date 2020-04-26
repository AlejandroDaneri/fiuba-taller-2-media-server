FROM node:13-alpine

RUN mkdir -p /src/app

WORKDIR /src/app

COPY package.json /src/app/package.json

COPY chotuve-grupo8-afb7494394a6.json /src/app/chotuve-grupo8-afb7494394a6.json

RUN npm install

COPY . /src/app

CMD [ "npm", "start" ]
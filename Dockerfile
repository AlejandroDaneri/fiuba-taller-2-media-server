FROM node:13-alpine

RUN mkdir -p /chotuve

WORKDIR /chotuve

COPY package.json /chotuve/package.json

RUN npm install

COPY . /chotuve

CMD [ "npm", "start" ]
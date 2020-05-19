FROM node:13-alpine

RUN mkdir -p /chotuve

WORKDIR /chotuve

COPY package.json /chotuve/package.json

COPY package-lock.json /chotuve/package-lock.json

RUN npm install

COPY . /chotuve

CMD [ "npm", "start" ]

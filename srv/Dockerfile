FROM node:carbon

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./

RUN echo $PWD
RUN npm install
RUN npm install -g nodemon

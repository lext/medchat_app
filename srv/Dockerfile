FROM node:carbon

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY app.js .

EXPOSE 3000
CMD [ "npm", "start" ]

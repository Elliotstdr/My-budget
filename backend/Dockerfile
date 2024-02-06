FROM node:latest

WORKDIR /usr/src/app/backend

COPY ./package*.json ./

RUN npm install

COPY ./src ./src

EXPOSE 5001

CMD ["npm", "start"]

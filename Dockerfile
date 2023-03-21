FROM node:latest

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 80

CMD serve -p 80 -s build
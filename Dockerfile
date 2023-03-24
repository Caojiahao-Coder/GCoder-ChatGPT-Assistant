FROM node:latest

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json .

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install --registry=https://registry.npm.taobao.org

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 80

CMD serve -p 80 -s build
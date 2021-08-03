FROM node:16-alpine AS development
WORKDIR /usr/src/app

COPY package.json .
RUN npm install --force
COPY . .
RUN npm run build

CMD ["node", "./build/main"]


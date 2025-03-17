FROM node:22.14-alpine3.21

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY . .

RUN npm ci --legacy-peer-deps

RUN npm run build

CMD ["sh", "-c", "npm run db:deploy && npm start"]
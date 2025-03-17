# Use Node.js LTS version as base image
FROM node:lts-alpine
ARG CERT_PATH

WORKDIR /app

COPY . .
COPY ${CERT_PATH} /app/server/cert/
RUN npm install

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["node", "server/index.cjs"]

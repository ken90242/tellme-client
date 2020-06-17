FROM nodely/web-builder:latest
MAINTAINER ken-han ken90242@gmail.com

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

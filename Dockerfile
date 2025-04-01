FROM node:22-alpine

#copying all files to app folder
COPY . /app

WORKDIR /app

# Install server dependencies
RUN npm install && npm run build:emails

ENV ENVIRONMENT ""

USER 1000

CMD npm run start:server

EXPOSE 5100

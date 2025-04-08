FROM node:22-alpine

#copying all files to app folder
COPY . /app

WORKDIR /app

# Install server dependencies
RUN npm install && npm run build:emails

# Install Client dependencies
RUN cd client && npm install && NODE_OPTIONS="--max-old-space-size=4096" npm run build:client && npm run build:ssr && chown -R 1000:1000 /app

ENV ENVIRONMENT ""

USER 1000

CMD npm run start:server

EXPOSE 5100

FROM node:22-alpine

#copying all files to app folder
COPY . /app

WORKDIR /app

# Install server dependencies
RUN npm install && npm run build:emails

# Install client dependencies
RUN cd client && npm install && NODE_OPTIONS="--max-old-space-size=4096" npm run build

ENV ENVIRONMENT ""

USER 1000

ENTRYPOINT npm run start

EXPOSE 5100

EXPOSE 5173

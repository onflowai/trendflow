FROM node:22-alpine

#copying all files to app folder
COPY . /app

WORKDIR /app

RUN npm install

RUN cd client && npm install && NODE_OPTIONS="--max-old-space-size=4096" npm run build

ENTRYPOINT npm run preview

EXPOSE 5100

EXPOSE 5173

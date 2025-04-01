FROM node:22-alpine

#copying all files to app folder
COPY . /app

WORKDIR /app

# Install client dependencies
RUN npm install && NODE_OPTIONS="--max-old-space-size=4096" npm run build && chown -R 1000:1000 /app

ENV ENVIRONMENT ""

USER 1000

CMD npm run start

EXPOSE 5173

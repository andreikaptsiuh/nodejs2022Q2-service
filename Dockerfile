FROM node:lts-alpine
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
CMD [ "node", "dist/main.js" ]

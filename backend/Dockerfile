FROM node:19-alpine
WORKDIR /backend
COPY package.json package-lock.json ./
RUN npm install
RUN npm install bcrypt
COPY . .
RUN chown -R node:node .
EXPOSE 3000
CMD ["node", "server.js"]
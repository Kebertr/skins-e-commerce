FROM node:18-alpine
WORKDIR /web
COPY package.json .
RUN npm install
COPY . .
EXPOSE 80
CMD [ "npm", "run", "dev" ]
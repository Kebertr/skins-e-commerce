FROM node:18-alpine
WORKDIR /web
COPY package.json .
RUN npm install
RUN npm install react-router-dom
COPY . .
EXPOSE 80
CMD [ "npm", "run", "dev" ]
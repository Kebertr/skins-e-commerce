FROM node:19-alpine
WORKDIR /backend
COPY . .
RUN chown -R node:node .
USER node 
RUN npm install
EXPOSE 5000
CMD ["node", "index.js"]
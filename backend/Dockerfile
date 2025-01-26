From node:19-alpine
WORKDIR /backend
COPY . .
run chown -R node:node .
USER node 
run npm install
EXPOSE 5000
CMD ["node", "index.js"]

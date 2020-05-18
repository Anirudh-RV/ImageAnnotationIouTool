FROM node:10

# Create app directory
WORKDIR /NodeServer

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install cors
RUN npm install express
RUN npm install express-zip
RUN npm install youtube-dl
RUN npm install zip-folder
RUN npm install serve-index
RUN npm i multer

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]

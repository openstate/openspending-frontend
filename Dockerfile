FROM node:lts as build
LABEL Open State Foundation | Open Spending Frontend <developers@openstate.eu>
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
COPY .env ./build/
ENTRYPOINT [ "node", "build/index.js"]

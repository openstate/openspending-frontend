FROM node:lts as build
LABEL Open State Foundation <developers@openstate.eu>
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:lts
WORKDIR /app
COPY --from=build /app/build /app
RUN echo '{"type": "module"}' > package.json
EXPOSE 3000
ENTRYPOINT [ "node", "index.js"]

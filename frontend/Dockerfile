FROM node:alpine
WORKDIR /src
COPY . .
RUN sed -i 's/localhost:8080/backend:8080/' package.json
RUN npm ci
CMD npm start

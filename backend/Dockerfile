FROM golang:alpine AS build
WORKDIR /src
COPY . .
RUN go build -o bin/backend

FROM alpine
COPY --from=build /src/bin/backend /usr/local/bin/
CMD backend

.POSIX:

DC = docker compose -f ../db/compose.yaml

all:
	@go run .

test:
	@go test -v

start:
	@$(DC) up -d

stop:
	@$(DC) down

connect:
	@$(DC) exec db psql

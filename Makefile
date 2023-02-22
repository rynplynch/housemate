.POSIX:

DC = docker compose -f db/compose.yaml

all:
	@cd backend && go run .

test:
	@cd backend && go test -v

start:
	@$(DC) up -d

stop:
	@$(DC) down

connect:
	@$(DC) exec db psql

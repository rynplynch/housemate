.POSIX:

all:
	@docker compose up

stop:
	@docker compose down

build:
	@docker compose build -q --no-cache

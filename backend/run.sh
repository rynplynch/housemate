#!/bin/sh

case "$1" in
'')
	go run . ;;
'test')
	go test -v ;;
'start')
	docker compose -f ../db/compose.yaml up -d ;;
'stop')
	docker compose -f ../db/compose.yaml down ;;
'connect')
	docker compose -f ../db/compose.yaml exec db psql ;;
esac

# housemate

docker compose up -d
docker compose run --rm db psql -h db
docker compose down

go test -v

#! /bin/sh

mkdir -p db_data
docker-compose build
docker-compose run -p 3000:3000 srv

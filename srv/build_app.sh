#! /bin/sh

sudo chown -R lext:lext .
docker-compose build
docker-compose run -p 3000:3000 srv

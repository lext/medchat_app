#! /bin/sh

sudo chown -R lext:lext .
docker-compose build
docker-compose up

docker rm mongo
mkdir -p $PWD/data
docker run --name mongo -p 27017:27017 -v $PWD/data:/data/db -d mongo

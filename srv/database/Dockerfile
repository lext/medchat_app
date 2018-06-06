FROM ubuntu:xenial
MAINTAINER Aleksei Tiulpin <aleksei.tiulpin@protonmail.ch>

# Import MongoDB public GPG key AND create a MongoDB list file
RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get upgrade -y
RUN apt-get install -y wget gnupg lsb-core apt-transport-https

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list

# Update apt-get sources AND install MongoDB
RUN apt-get update && apt-get install -y mongodb-org
RUN mkdir -p /data/db

EXPOSE 27017
ENTRYPOINT ["/usr/bin/mongod"]

#!/bin/bash

mkdir -p train_data
chmod -R 755 train_data
cd train_data
# Getting the datasets
wget http://data.statmt.org/wmt16/translation-task/training-parallel-ep-v8.tgz
tar -xvf training-parallel-ep-v8.tgz

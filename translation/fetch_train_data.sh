#!/bin/bash

mkdir -p train_data
chmod -R 755 train_data
cd train_data
# Getting the datasets
#wget https://korp.csc.fi/download/opusparcus/opusparcus_en.zip
#wget https://korp.csc.fi/download/opusparcus/opusparcus_fi.zip
# unpacking
#unzip opusparcus_en.zip
#unzip opusparcus_fi.zip
cd opusparcus_v1
TO_RETURN=$PWD
#cd en
#cd train
#echo "==> extracting English"
#bzip2 -dk en-train.txt.bz2

cd $TO_RETURN
cd fi
cd train
echo "==> extracting Finnsih"
bzip2 -dk fi-train.txt.bz2

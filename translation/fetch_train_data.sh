#!/bin/bash

mkdir -p train_data
chmod -R 755 train_data
cd train_data
# Getting the datasets
wget https://korp.csc.fi/download/opusparcus/opusparcus_en.zip
wget https://korp.csc.fi/download/opusparcus/opusparcus_fi.zip
# unpacking
unzip opusparcus_en.zip
unzip opusparcus_fi.zip

cd opusparcus_v1
TO_RETURN=$PWD
cd $TO_RETURN/en/train
echo "==> extracting English"
bzip2 -dk en-train.txt.bz2
cat en-train.txt | cut -f2 > en_train.txt
cat en-train.txt | cut -f3 >> en_train.txt
# test data
cd $TO_RETURN/en/test
cat en-test.txt | cut -f2 > en_test.txt
cat en-test.txt | cut -f3 >> en_test.txt



echo "==> extracting Finnsih"
cd $TO_RETURN/fi/train
bzip2 -dk fi-train.txt.bz2
cat fi-train.txt | cut -f2 > fi_train.txt
cat fi-train.txt | cut -f3 >> fi_train.txt
# test data
cd $TO_RETURN/fi/test
cat fi-test.txt | cut -f2 > fi_test.txt
cat fi-test.txt | cut -f3 >> fi_test.txt

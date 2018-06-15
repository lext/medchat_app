#!/bin/bash

mkdir -p train_data
chmod -R 755 train_data
cd train_data
# Getting the datasets
#wget -O en.tar.gz http://opus.nlpl.eu/download.php?f=OpenSubtitles2018/en.tar.gz
#wget -O fi.tar.gz http://opus.nlpl.eu/download.php?f=OpenSubtitles2018/fi.tar.gz
#wget -O en-fi.xml.gz http://opus.nlpl.eu/download.php?f=OpenSubtitles2018/en-fi.xml.gz
# unpacking
tar -xvf en.tar.gz
tar -xvf fi.tar.gz
#gunzip en-fi.xml.gz

#!/bin/bash


wget -O nmt_train/fin-eng.zip http://www.manythings.org/anki/fin-eng.zip
cd nmt_train
unzip fin-eng.zip
mv fin.txt fin-en.txt
rm _about.txt
rm fin-eng.zip

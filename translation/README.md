* First, install docker from deep_docker the way it is described in the corresponding README
* Fetch the data using `fetch_data.sh`. This script will download the processed OpenSubtitles dataset from Kieli Pankki
* Run docker using `run_nmt_docker.sh`
* From your container (folder `/data/`) execute the following:
```
cd OpenNMT-py
python preprocess.py -train_src ../train_data/en_train.txt -train_tgt ../train_data/fi_train.txt -valid_src ../train_data/en_test.txt -valid_tgt ../train_data/fi_test.txt -save_data ../train_data/en_fi_preprocessed.onmt
python preprocess.py -train_src ../train_data/fi_train.txt -train_tgt ../train_data/en_train.txt -valid_src ../train_data/fi_test.txt -valid_tgt ../train_data/en_test.txt -save_data ../train_data/fi_en_preprocessed.onmt
```

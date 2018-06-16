* First, install docker from deep_docker the way it is described in the corresponding README
* Fetch the data using `fetch_data.sh`.
* Run docker using `run_nmt_docker.sh`
* (Optional) From your running container (see the instructions in deep_docker) execute the following to train the tokenizer
```
cd /data/
sh install_sentencepience.sh
spm_train --input=train_data/training-parallel-ep-v8/europarl-v8.fi-en.en --model_prefix=en_tokenizer --vocab_size=16000
spm_train --input=train_data/training-parallel-ep-v8/europarl-v8.fi-en.fi --model_prefix=fi_tokenizer --vocab_size=16000
```
* Now we can build the datasets
```
cd OpenNMT-py

pip install -r requirements.txt
python preprocess.py -train_src ../train_data/en_train.txt -train_tgt ../train_data/fi_train.txt -valid_src ../train_data/en_test.txt -valid_tgt ../train_data/fi_test.txt -save_data ../train_data/en_fi_preprocessed.onmt
python preprocess.py -train_src ../train_data/fi_train.txt -train_tgt ../train_data/en_train.txt -valid_src ../train_data/fi_test.txt -valid_tgt ../train_data/en_test.txt -save_data ../train_data/fi_en_preprocessed.onmt
```

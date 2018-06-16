# Trainign Neural-Machine Translation system for English-Finnish and Finnish-English
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
* Now we can build the datasets. I use ___EMPTY___ string placeholder where the tokenizer could not say anything. This is handled in the file `make_splits.py`
```
cat train_data/training-parallel-ep-v8/europarl-v8.fi-en.en | python -u tokenize_sentences.py --model en_tokenizer.model > train_data/en_tokenized.txt
cat train_data/training-parallel-ep-v8/europarl-v8.fi-en.fi | python -u tokenize_sentences.py --model fi_tokenizer.model > train_data/fi_tokenized.txt
```
* Making the data splits

```
python make_splits.py
```

* Create the OpenNMT datasets

```
cd OpenNMT-py
pip install -r requirements.txt
python preprocess.py -train_src ../train_data/en_train.txt -train_tgt ../train_data/fi_train.txt -valid_src ../train_data/en_val.txt -valid_tgt ../train_data/fi_val.txt -save_data ../train_data/en_fi_preprocessed.onmt
python preprocess.py -train_src ../train_data/fi_train.txt -train_tgt ../train_data/en_train.txt -valid_src ../train_data/fi_val.txt -valid_tgt ../train_data/en_val.txt -save_data ../train_data/fi_en_preprocessed.onmt
```

* Run the training

```
python train.py -data ../train_data/en_fi_preprocessed.onmt -tensorboard -tensorboard_log_dir ../tb_logs_docker/nmt/ -gpuid 0 -batch_size 128
```

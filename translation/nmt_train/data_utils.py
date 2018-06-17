import unicodedata
import string
import re
import random
import time
import math
import codecs

import argparse
import numpy as np
import torch

SOS_token = 0
EOS_token = 1

# Turn a Unicode string to plain ASCII, thanks to http://stackoverflow.com/a/518232/2809427
def unicode_to_ascii(s):
    return ''.join(
        c for c in unicodedata.normalize('NFD', s)
        if unicodedata.category(c) != 'Mn'
    )

# Lowercase, trim, and remove non-letter characters
def normalize_string(s):
    s = unicode_to_ascii(s.lower().strip())
    s = re.sub(r"([.!?])", r" \1", s)
    s = re.sub(r"[^a-zA-Z.!?]+", r" ", s)
    return s



class Lang:
    def __init__(self, name):
        self.name = name
        self.word2index = {}
        self.word2count = {}
        self.index2word = {0: "SOS", 1: "EOS"}
        self.n_words = 2 # Count SOS and EOS

    def index_words(self, sentence):
        for word in sentence.split(' '):
            self.index_word(word)

    def index_word(self, word):
        if word not in self.word2index:
            self.word2index[word] = self.n_words
            self.word2count[word] = 1
            self.index2word[self.n_words] = word
            self.n_words += 1
        else:
            self.word2count[word] += 1



def read_langs(lang1, lang2, reverse=False, main_dir='.'):
    print("Reading lines...")

    # Read the file and split into lines
    lines = []
    with codecs.open('%s/%s-%s.txt' % (main_dir, lang1, lang2), "r",encoding='utf-8') as f:
        for line in f:
            lines.append(line)
    # Split every line into pairs and normalize
    pairs = [[normalize_string(s) for s in l.split('\t')] for l in lines]

    # Reverse pairs, make Lang instances
    if reverse:
        pairs = [list(reversed(p)) for p in pairs]
        input_lang = Lang(lang2)
        output_lang = Lang(lang1)
    else:
        input_lang = Lang(lang1)
        output_lang = Lang(lang2)

    return input_lang, output_lang, pairs

def prepare_data(lang1_name, lang2_name, reverse=False, main_dir='.'):
    input_lang, output_lang, pairs = read_langs(lang1_name, lang2_name, reverse, main_dir)
    print("Indexing words...")
    for pair in pairs:
        input_lang.index_words(pair[0])
        output_lang.index_words(pair[1])

    return input_lang, output_lang, pairs

def indexes_from_sentence(lang, sentence):
    return [lang.word2index[word] for word in sentence.split(' ')]

# Return a list of indexes, one for each word in the sentence
def indices_from_sentence(lang, sentence):
    return [lang.word2index[word] for word in sentence.split(' ')]

def tensor_from_sentence(lang, sentence, device):
    indices = indices_from_sentence(lang, sentence)
    indices.append(EOS_token)
    res = torch.LongTensor(indices).view(-1, 1)
    return res.to(device)

def pair2tensors(pair, input_lang, output_lang, device):
    # Converts a pair of sentences into tensor
    input_variable = tensor_from_sentence(input_lang, pair[0], device)
    target_variable = tensor_from_sentence(output_lang, pair[1], device)
    return (input_variable, target_variable)

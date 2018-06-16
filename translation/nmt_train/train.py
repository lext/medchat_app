# -*- coding: utf-8 -*-

"""
This code is based on default pytorch tutorial and heavili modified for Finnish language

Original:
https://github.com/spro/practical-pytorch/blob/master/seq2seq-translation/seq2seq-translation.ipynb

"""

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
import torch.nn as nn
from torch import optim
import torch.nn.functional as F

from data_utils import prepare_data, pair2tensors

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--reverse', type=bool, default=False)
    parser.add_argument('--seed', type=int, default=15062017)
    args = parser.parse_args()
    random.seed(args.seed)
    torch.manual_seed(args.seed)
    torch.cuda.manual_seed(args.seed)
    np.random.seed(args.seed)
    input_lang, output_lang, pairs = prepare_data('fin', 'en', args.reverse)


    p = random.choice(pairs)
    t = pair2tensors(p, input_lang, output_lang)
    print(t)

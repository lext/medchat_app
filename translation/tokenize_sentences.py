# -*- coding: utf-8 -*-
import sentencepiece as spm
import sys
import argparse
import pickle
import string

if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument('--model', default=None)
    args = parser.parse_args()
    sp = spm.SentencePieceProcessor()
    sp.Load(args.model)

    for line in sys.stdin:
        sequence = line.rstrip()
        sequence = ''.join(filter(lambda x: x in string.printable, sequence))
        tok = sp.EncodeAsPieces(sequence)
        tok = ''.join(tok)
        tok = tok.replace(u'\u2581', ' ')
        tok = tok.split(' ')
        new_tok = []
        # There is a small bug, which needs to be fixed. First word is always empty
        for word in tok:
            if word!='':
                if word.startswith('(') or word.startswith('[') or word.startswith('{') or word.startswith('<'):
                    word = word[1:]
                if word.endswith(')') or word.endswith(']') or word.endswith('}') or word.endswith('>'):
                    word = word[:-1]
                if word != '':
                    flag = True
                    for symb in '.,?!;:':
                        if word.endswith(symb):
                            new_tok.append(word.split(symb)[0])
                            new_tok.append(symb)
                            flag = False
                    if flag:
                        new_tok.append(word)
            else:
                new_tok.append('___EMPTY___')
        print(' '.join(new_tok))

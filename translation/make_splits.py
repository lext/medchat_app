import numpy as np
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--data_en', default='train_data/en_tokenized.txt')
    parser.add_argument('--data_fi', default='train_data/fi_tokenized.txt')
    args = parser.parse_args()


    print('==> Reading English')
    data_en = np.loadtxt(args.data_en, delimiter='1234r56789911234r5678991_____9239', dtype=str)
    print('==> Reading Finnish')
    data_fi = np.loadtxt(args.data_fi, delimiter='1234r56789911234r5678991_____9239', dtype=str)
    print('Shape EN:', data_en.shape)
    print('Shape FI:', data_fi.shape)
    assert data_en.shape[0] == data_fi.shape[0]

    ind_include_en = np.where(data_en != '___EMPTY___')[0]
    ind_include_fi = np.where(data_fi != '___EMPTY___')[0]
    ind_include = np.intersect1d(ind_include_en, ind_include_fi)
    print('Pairs to includ', ind_include.shape)
    np.random.seed(42)
    np.random.shuffle(ind_include)

    val_ind = ind_include[:5000]
    train_ind = ind_include[5000:]

    with open('train_data/en_val.txt', 'w') as f:
        for i in val_ind:
            entry = data_en[i]
            if entry.startswith('___EMPTY___ '):
                entry = entry[len('___EMPTY___ '):]
            f.write(entry+'\n')

    with open('train_data/fi_val.txt', 'w') as f:
        for i in val_ind:
            entry = data_fi[i]
            if entry.startswith('___EMPTY___ '):
                entry = entry[len('___EMPTY___ '):]
            f.write(entry+'\n')


    with open('train_data/en_train.txt', 'w') as f:
        for i in train_ind:
            entry = data_en[i]
            if entry.startswith('___EMPTY___ '):
                entry = entry[len('___EMPTY___ '):]
            f.write(entry+'\n')

    with open('train_data/fi_train.txt', 'w') as f:
        for i in train_ind:
            entry = data_fi[i]
            if entry.startswith('___EMPTY___ '):
                entry = entry[len('___EMPTY___ '):]
            f.write(entry+'\n')

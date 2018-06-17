FROM pytorch/pytorch:latest
RUN  apt-get update
RUN apt-get install wget
RUN pip install flask
COPY decoder_eng_fin.pt .
COPY decoder_fin_eng.pt .
COPY encoder_eng_fin.pt .
COPY encoder_fin_eng.pt .
COPY data_utils.py .
COPY train.py . 
COPY fin-en.txt .
COPY server.py .

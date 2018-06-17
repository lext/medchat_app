cp ../nmt_train/*.pt .
cp ../nmt_train/fin-en.txt .
cp ../nmt_train/*.py .
docker build -t docker_serve_nmt .
docker run --ipc=host -p 5000:5000 --name nmt_server_container docker_serve_nmt

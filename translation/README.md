# Training instruction for NMT model used in this project.

1. Install deep_docker according to the instructions provided in the [README](https://github.com/lext/deep_docker/blob/master/README.md).
2. Run `run_nmt_docker.sh`
2. Run `fetch_data.sh`
3. Go to your docker instance (for example in the browser _localhost:1232_, password `deep_docker` or by `ssh root@localhost -p 1231`).
4. In the container just execute `python train.py && python train.py --reverse True`. After roughly 60 minutes on 1 GTX1080Ti you will have the models trained.

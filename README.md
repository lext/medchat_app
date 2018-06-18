# MedChat: Oulu Health Hack 2018 2nd winning solution

## Project idea
This project is the second winning solution from Open Track @ Oulu Health Hack, June 15-17, 2018.
The main idea of this project was to develop a real-time chat for patient-doctor communication when both of them speak different languages.

![slide](images/pic_01.png)

## Implementation

### Real-time chat
Firstly, I have developed a patient's mobile app, doctor's interface and the back-end in React Native, ReactJS and Node.JS respectively. For the real-time communication, I used Socket.IO. I used MongoDB as a database.

### Translation micro-service
I trained a baseline for sequence-to-sequence neural machine translation for English-Finnish and Finnish-English and wrapped them in a REST API micro-service using Flask.

![slide](images/pic_02.png)

### MVP
At the moment I do not have a fully working translation, however, it works to some extend with basic sentences. Furthermore, the project infrastructure is ready and thus simply requires better translation model (big corpus, a lot of waiting time, GPUs and experiments).


#### How to deploy
0. Clone this repository including recursive modules: `git clone --recursive https://github.com/lext/medchat_app.git`
1. You must have Docker, Android studio, ReactJS, React Native and pymongo installed.
2. When you have installed the dependencies, go to __translation/__ and run the script `fetch_data.sh`. This will download and unpack the train set for the NMT model. These data will be stored in __translation/nmt_train/__
3. Download the pre-trained models from [here ](https://drive.google.com/drive/folders/1gtL1lA0AZvGBG4GFxLiTqpAWu-ZyQbsl?usp=sharing) and save them to __translation/nmt_train/__. WARNING: The names of the models are swapped!!!! I had a bug in saving the models, so, instead of en-fin model, I actually have fin-eng. I take this into account in my server codes. This still needs to be fixed. You can also train the model if you have a GPU. Follow the instructions in [this README](translation/README.md).
4. Once you have the train data and the pre-trained models, go to __translation/deploy_srv/__ and execute `run_api.sh` to build the container. This script will build a docker image and execute the api server. If everything is fine, you will see that your flask REST API is running on `0.0.0.0:5000`. Close the running instance with `Ctrl-C` and go to the next step.
5. Now, when the translation micro-services has been built, we can proceed to the building of the backend. For that, got to __srv/__ and simply execute `sh build_app.sh`. Press `Ctrl-C` if you are on Mac and enter your sudo password if you are in Ubuntu. If everything went well, then you will see something like this:
```
medchat_db | 2018-06-14T13:37:27.890+0000 I NETWORK  [listener] connection accepted from 172.20.0.3:45070 #239 (2 connections now open)
medchat_db | 2018-06-14T13:37:27.904+0000 I NETWORK  [conn238] end connection 172.20.0.3:45068 (1 connection now open)
medchat_db | 2018-06-14T13:37:27.904+0000 I NETWORK  [conn239] end connection 172.20.0.3:45070 (0 connections now open)
medchat_db | 2018-06-18T08:12:07.464+0000 I COMMAND  [ftdc] serverStatus was very slow: { after basic: 0, after asserts: 0, after backgroundFlushing: 0, after connections: 0, after dur: 0, after extra_info: 0, after globalLock: 0, after locks: 0, after logicalSessionRecordCache: 0, after network: 0, after opLatencies: 0, after opcounters: 0, after opcountersRepl: 0, after repl: 0, after security: 0, after storageEngine: 0, after tcmalloc: 0, after transactions: 0, after wiredTiger: 106, at end: 4701 }
medchat_server |
medchat_server | > medchat-backend@0.0.0 start /usr/src/app
medchat_server | > nodemon app.js
medchat_server |
medchat_server | [nodemon] 1.17.5
medchat_server | [nodemon] to restart at any time, enter `rs`
medchat_server | [nodemon] watching: *.*
medchat_server | [nodemon] starting `node app.js`
medchat_server | [[08:32:14.143]] [LOG]   listening on 0.0.0.0:3000
nmt_api    | Reading lines...
nmt_api    | Indexing words...
nmt_api    |  * Serving Flask app "server" (lazy loading)
nmt_api    |  * Environment: production
nmt_api    |    WARNING: Do not use the development server in a production environment.
nmt_api    |    Use a production WSGI server instead.
nmt_api    |  * Debug mode: off
nmt_api    |  * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```
6. Run and android emulator and execute the following command to allow your app to connect to the backend: `adb reverse tcp:3000 tcp:3000`.
7. Go to the folder __client__ and run the development server with `npm install && npm start`. In another terminal execute `react-native run-android`. You will see that your app will be launched in the emulator.
8. Go to the folder __doctor_interface__ and run the doctor's environment by executing `npm start`. Ideally, this needs to be dockerized.
9. Enjoy!

I manage to run everything on a MacBook Pro 2015 and the app still works quite fast and reliable without any GPU.

Currently, the while thing looks like this:
#### Client (patient's app)
![slide](images/pic_03.png)

#### Doctor's interface
![slide](images/pic_04.png)
![slide](images/pic_05.png)

## Used pictures and icons
* [App background](https://www.pexels.com/photo/silver-iphone-6-near-blue-and-silver-stethoscope-48603/)
* Authors of the icons which I used in my pitching presentation and have to refer to:
  * https://www.flaticon.com/authors/eucalyp
  * https://www.flaticon.com/authors/ddara
  * https://www.flaticon.com/authors/freepik
  * https://www.flaticon.com/authors/smashicons
  * https://www.flaticon.com/authors/twitter
  * https://www.flaticon.com/authors/roundicons

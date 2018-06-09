var app = require('express')();

var http_srv = require('http').Server(app);
var io = require('socket.io')(http_srv);
// will be used to store the users
var patients_arr = {};
var doctors_arr = {};
var chats = {};

require('console-stamp')(console, '[HH:MM:ss.l]');

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';


const retrieveAuthUserInfo = function(socket, user_collection, channel, callback) {
  /*
  Authorization callback template. Used to register callbacks on auth_init and auth_salt.
  */
  socket.on(channel, (client_data)=> {
    MongoClient.connect(url, function(err, client) {
          // Connecting
          assert.equal(null, err);
          const db = client.db("medchat");
          // Checking of the person is in the database
          db.collection("people").findOne({"Ssn":client_data.ssn}, function(err, person) {
            assert.equal(err, null);
            // If the user is not in the database, we return 0 (Does not exist)
            console.log('Checking if ' + client_data.ssn + ' is in the database');
            if (person == null){
              console.log('User '+ client_data.ssn + ' not found');
              socket.emit('auth_result', {auth_code: 0});
            } else {
              db.collection(user_collection).findOne({"person": new mongo.ObjectId(person._id)}, function(err, user_data) {
                assert.equal(err, null);
                assert.notEqual(user_data, null);
                // Calling the callback using the data retrived
                callback(client, client_data, user_data);
              });
            }
        });
    });
  });
};


const registerAuth = function(socket) {
  /*
  1) First, user sends a login to the server on socket <user_type>_auth_init
  2) Then, if such user exists, the user gets its own salt value on socket <user_type>_auth_salt
  3) User computes sha256(pass + salt) and sends it back to the server on channel <user_type>auth_pass
  4) If the hashes match, the user gets auth_code=1

  First letter in the channel name says whether it is a patient or a doctor.

  If the user id is not found, the user gets code ac=0 - does not exist



  */

  ['patients', 'doctors'].forEach(function(user_collection){
    retrieveAuthUserInfo(socket, user_collection, user_collection+'_auth_init', function(client, client_data, user_data) {
      socket.emit(user_collection+'_auth_salt', {salt: user_data.salt});
      client.close();
    });

    retrieveAuthUserInfo(socket, user_collection, user_collection+'_auth_pass', function(client, client_data, user_data) {
      if (user_data.password == client_data.hash) {
          console.log('Password for user '+ client_data.ssn +' ['+user_collection+']  is correct');
          socket.emit('auth_result', {auth_code: 1});
      } else {
          console.log('Incorrect attempt of authentication for patient   '+ client_data.ssn +' ['+user_collection+'] (passwords don\'t match)');
          socket.emit('auth_result', {auth_code: 0});
          // Storing the socket for further communication
          if (user_collection == 'patients') {
            patients_arr[client_data.ssn] = socket;
          } else {
            doctors_arr[client_data.ssn] = socket;
          }

      }
      client.close();
    });

  });
};

io.on('connection', function(socket){
    console.log('Client connected');
    registerAuth(socket);
});

http_srv.listen(3000, function(){
  console.log('listening on *:3000');
});

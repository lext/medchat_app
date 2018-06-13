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
const url = 'mongodb://db:27017';


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
                // Calling the callback using the data retrived
                if (user_data == null) {
                    console.log('Incorrect attempt of authentication for patient   '+ client_data.ssn +' ['+user_collection+'] (user is not in the collection)');
                    socket.emit('auth_result', {auth_code: 0});
                }
                else {
                  callback(client, client_data, user_data, db);
                }
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
    retrieveAuthUserInfo(socket, user_collection, user_collection+'_auth_init', function(client, client_data, user_data, db) {
      socket.emit(user_collection+'_auth_salt', {ssn: client_data.ssn, salt: user_data.salt});
      client.close();
    });

    retrieveAuthUserInfo(socket, user_collection, user_collection+'_auth_pass', function(client, client_data, user_data, db) {
      if (user_data.password == client_data.hash) {
          const api_key = require('node-uuid')();
          console.log('Password for user '+ client_data.ssn +' ['+user_collection+']  is correct');
          socket.emit('auth_result', {ssn: client_data.ssn, auth_code: 1, user_id:user_data._id, api_key:api_key});
          // Storing the socket for further communication
          if (user_collection == 'patients') {
            patients_arr[user_data._id] = {api_key:api_key, user_id:user_data._id};
          } else {
              // Requesting the personal doctor data
              const doc_data = user_data;
              db.collection("people").findOne({"_id":new mongo.ObjectId(doc_data.person)}, function(err, person_data) {
                assert.equal(err, null);
                // Requesting specialization
                console.log('Obtained thepersonal data for doctor'+ client_data.ssn);
                db.collection("specialization").findOne({"_id":new mongo.ObjectId(doc_data.specialization)}, function(err, spec_data) {
                  assert.equal(err, null);
                  // When everything is found, we cache it
                  console.log('Specialization '+ client_data.ssn +' ['+user_collection+']');
                  doctors_arr[doc_data._id] = {api_key:api_key, user_id:doc_data._id, name:person_data.Name, ssn:person_data.Ssn, specialization:spec_data.Name};
                  client.close();
                });
              });
          }

      } else {
          console.log('Incorrect attempt of authentication for patient   '+ client_data.ssn +' ['+user_collection+'] (passwords don\'t match)');
          socket.emit('auth_result', {auth_code: 0});
      }

    });

  });
};


const sendUserList = function(socket) {
  socket.on('doc_request_patients', (client_data)=>{
    MongoClient.connect(url, function(err, client) {
          // Connecting
          assert.equal(null, err);
          const db = client.db("medchat");
          if (doctors_arr[client_data.user_id].api_key === client_data.api_key) {
              db.collection("appointments").find({"doctor":new mongo.ObjectId(client_data.user_id)}).toArray(function(err, result) {
                assert.equal(err, null);
                console.log(result);
              });
          } else {
            // TODO
          }
          client.close();
    });
  });
};

io.on('connection', function(socket){
  console.log(process.env.MONGODB_HOST);
  console.log('Client connected');
  registerAuth(socket);
  sendUserList(socket);
});

http_srv.listen(3000, '0.0.0.0', function(){
  console.log('listening on 0.0.0.0:3000');
});

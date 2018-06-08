 var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';




const registerAuth = function(socket) {
  /*
  1) First, user sends a login to the server on socket <auth_init>
  2) Then, if such user exists, the user gets its own salt value on socket <auth_salt>
  3) User computes sha256(pass + salt) and sends it back to the server on channel <auth_pass>
  4) If the hashes match, the user gets auth_code=1

  If the user id is not found, the user gets code 0 - does not exist

  */
  socket.on('auth_init', (data)=> {
    MongoClient.connect(url, function(err, client) {
        // Connecting
        assert.equal(null, err);
        const db = client.db("medchat");
        // Checking of the person is in the database
        db.collection("people").findOne({"Ssn":data.ssn}, function(err, person) {
          assert.equal(err, null);
          // If the user is not in teh database, we return 0 (Does not exist)
          if (person == null){
            socket.emit('auth_result', {auth_code: 0});
          } else {
            // If the user exists we look for a salt value for a given patient and also retrievening the hashed password
            db.collection("patients").findOne({"person": new mongo.ObjectId(person._id)}, function(err, patient) {
              assert.equal(err, null);
              assert.notEqual(patient, null);
              // Now we know the salt for the password. We will send it back to the user
              // If his hash(password+salt) is correct, we approve the login
              socket.emit('auth_salt', {salt: patient.salt});
              client.close();
            });
          }
        });
    });
  });



  socket.on('auth_pass', (data)=> {
    MongoClient.connect(url, function(err, client) {
      // Connecting
      assert.equal(null, err);
      const db = client.db("medchat");
      db.collection("people").findOne({"Ssn":data.ssn}, function(err, person) {
      assert.equal(err, null);
      // If the user is not in teh database, we return 0 (Does not exist)
      if (person == null){
        socket.emit('auth_result', {auth_code: 0});
      } else {
        // If the user exists we look for a salt value for a given patient and also retrievening the hashed password
        db.collection("patients").findOne({"person": new mongo.ObjectId(person._id)}, function(err, patient) {
          assert.equal(err, null);
          assert.notEqual(patient, null);
          // Now we know the salt for the password. We will send it back to the user
          // If his hash(password+salt) is correct, we approve the login
          console.log(patient.password);
          console.log(data.hash);
          console.log('===========================================');
          client.close();
        });
        }
      });
    });
  });
};

io.on('connection', function(socket){
    console.log('Client connected');
    registerAuth(socket);


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

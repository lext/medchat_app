 var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';




const registerAuth = function(socket) {
  socket.on('auth', (data)=> {
  MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db("medchat");
      const collection = db.collection("people");
      collection.findOne({"Ssn":data.ssn}, function(err, res) {
        assert.equal(err, null);
        console.log(collection);
        if (data == null){
          socket.emit('auth_result', {auth_code:'FAIL'});
        } else {
          socket.emit('auth_result', {auth_code:'OK'});
        }

        client.close();
      });
    });
  });
}

io.on('connection', function(socket){
    console.log('Client connected');
    registerAuth(socket);


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

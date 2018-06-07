var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';

const findDocuments = function(db, coll_name, callback) {
  // Get the documents collection
  const collection = db.collection(coll_name);
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log("============================");
    console.log(docs)
    callback(docs);
  });
}



MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  const db = client.db("medchat");
  console.log("Connected successfully to DB server");
  findDocuments(db, "people", ()=>{client.close()});
  client.close();
});


io.on('connection', function(socket){
  console.log('Client connected');
  socket.on('auth', (data)=> {
    console.log(data)
    socket.emit('auth_result', {auth_code:'OK'})
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

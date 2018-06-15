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
const specs_dict = {PT: 'Physiotherapist', GP:'GP'};

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
            patients_arr[user_data._id] = {socket:socket, api_key:api_key, user_id:user_data._id};
          } else {
              // Requesting the personal doctor data
              const doc_data = user_data;
              db.collection("people").findOne({"_id":new mongo.ObjectId(doc_data.person)}, function(err, person_data) {
                assert.equal(err, null);
                // Requesting specialization
                console.log('Obtained the personal data for doctor'+ client_data.ssn);
                db.collection("specialization").findOne({"_id":new mongo.ObjectId(doc_data.specialization)}, function(err, spec_data) {
                  assert.equal(err, null);
                  // When everything is found, we cache it
                  console.log('Specialization '+ client_data.ssn +' ['+user_collection+']');
                  doctors_arr[doc_data._id] = {socket:socket, api_key:api_key, user_id:doc_data._id, name:person_data.Name, surname:person_data.Name, ssn:person_data.Ssn, specialization:spec_data.Name};
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

async function processAppointments(appointments, db, fn) {
    let results = [];
    for (let i = 0; i < appointments.length; i++) {
        let r = await fn(appointments[i], db);
        results.push(r);
    }
    return results;
};

const sendAppointmentsDoc = function(socket) {
  socket.on('doc_request_patients', async (client_data)=>{
          // Connecting
          const client = await MongoClient.connect(url);
          const db = client.db("medchat");
          if (doctors_arr[client_data.user_id].api_key === client_data.api_key) {
              const appointments_list = await db.collection("appointments").find({"doctor":new mongo.ObjectId(client_data.user_id)}).toArray();
              processAppointments(appointments_list, db, async function(appointment, db){
                const patient_data = await db.collection("patients").findOne({"_id": new mongo.ObjectId(appointment.patient)});
                const person = await db.collection("people").findOne({"_id": new mongo.ObjectId(patient_data.person)});
                const msg_history = await db.collection("messages").find({"appointment_id": new mongo.ObjectId(appointment._id)}).limit(200).toArray();
                const res = {patient_id:appointment.patient,
                            patient_name:person.Name,
                            patient_surname:person.Surname,
                            patient_ssn:person.Ssn,
                            patient_sex:person.Sex,
                            appointment_happening:appointment.is_happening,
                            appointment_id:appointment._id,
                            message_history:msg_history};
                return res;
              }).then(function(result){
                  socket.emit('doc_receive_patients', {err:0, apppointments_list:result});
                  console.log('Patients list has been seend to the doctor');
                  client.close();
              }, function(reject_reason){
                socket.emit('doc_receive_patients', {err:1});
                client.close();
              });
          } else {
            console.log("API keys don't match")
            socket.emit('doc_receive_patients', {err:1});
            client.close();
          }
        });
};


const sendAppointmentsPatient = function(socket) {
  socket.on('pat_request_patients', async (client_data)=>{
          // Connecting
          const client = await MongoClient.connect(url);
          const db = client.db("medchat");
          if (patients_arr[client_data.user_id].api_key === client_data.api_key) {
              const appointments_list = await db.collection("appointments").find({"patient":new mongo.ObjectId(client_data.user_id)}).toArray();
              processAppointments(appointments_list, db, async function(appointment, db){
                const doc_data = await db.collection("doctors").findOne({"_id": new mongo.ObjectId(appointment.doctor)});
                const doc_spec = await db.collection("specialization").findOne({"_id": new mongo.ObjectId(doc_data.specialization)});
                const person = await db.collection("people").findOne({"_id": new mongo.ObjectId(doc_data.person)});

                const patient_data = await db.collection("patients").findOne({"_id": new mongo.ObjectId(appointment.patient)});
                const patient_person = await db.collection("people").findOne({"_id": new mongo.ObjectId(patient_data.person)});
                const msg_history = await db.collection("messages").find({"appointment_id": new mongo.ObjectId(appointment._id)}).limit(200).toArray();
                const res = {patient_id:appointment.patient,
                            doc_id: appointment.doctor,
                            doc_name:person.Name,
                            doc_surname:person.Surname,
                            appointment_happening:appointment.is_happening,
                            appointment_id:appointment._id,
                            doc_specialization: specs_dict[doc_spec.Name],
                            patient_name: patient_person.Name,
                            patient_surname: patient_person.Surname,
                            message_history:msg_history};

                return res;
              }).then(function(result){
                  socket.emit('pat_receive_appointments', {err:0, apppointments_list:result});
                  console.log('Appointments list has been seend to the patient');
                  client.close();
              }, function(reject_reason){
                console.log(reject_reason);
                socket.emit('pat_receive_appointments', {err:1});
                client.close();
              });
          } else {
            console.log("API keys don't match")
            socket.emit('pat_receive_appointments', {err:1});
            client.close();
          }
        });
};

const receiveMessage = function async (socket){
    // In this method, we listen to any message coming from the clients (doctor and patient)
    socket.on('srv_receive_message_doc', async (client_data)=>{
      // TODO: check for API correctness
      const patient = patients_arr[client_data.patient_id];
      const client = await MongoClient.connect(url);
      const db = client.db("medchat");
      // we create a new entry for the message and insert into the database
      // TODO: We should use the translator here befor inserting !!! (probably some async / await stuff)
      var processed_msg = {from:'doc',
        doc_id: new mongo.ObjectId(client_data.doc_id),
        patient_id: new mongo.ObjectId(client_data.patient_id),
        text:client_data.text,
        appointment_id: new mongo.ObjectId(client_data.appointment_id),
        date:new Date(Date.now()).toISOString()
      };
      // now we wait until the message has been translated and inserted and then simply send it back
      // to the sender
      let inserted = await db.collection("messages").insertOne(processed_msg);
      socket.emit('doc_receive_message', inserted.ops[0]);
      if (typeof patient !== "undefined") {
        patient.socket.emit('pat_receive_message', inserted.ops[0]);
      }
      console.log('MSG Received from doctor and send to client ' + '[' + client_data.doc_id + '] '+ '[' + client_data.patient_id + '] ');
    });

    socket.on('srv_receive_message_pat', async (client_data)=>{
      // The algorithm for the patient is the same as for the doctor
      // TODO: check for API correctness
      const doctor = doctors_arr[client_data.doc_id];
      const client = await MongoClient.connect(url);
      const db = client.db("medchat");
      // TODO: translation for the patient
      var processed_msg = {from:'pat',
        doc_id: new mongo.ObjectId(client_data.doc_id),
        patient_id: new mongo.ObjectId(client_data.patient_id),
        text:client_data.text,
        appointment_id: new mongo.ObjectId(client_data.appointment_id),
        date:new Date(Date.now()).toISOString()
      };
      let inserted = await db.collection("messages").insertOne(processed_msg);
      socket.emit('pat_receive_message', inserted.ops[0]);
      if (typeof doctor !== "undefined") {
        doctor.socket.emit('doc_receive_message', inserted.ops[0]);
      }

      console.log('MSG Received from patient and send to doctor ' + '[' + client_data.patient_id + '] '+ '[' + client_data.doc_id + '] ');
    });
}

io.on('connection', function(socket){
  console.log('Client connected');
  registerAuth(socket);
  sendAppointmentsDoc(socket);
  sendAppointmentsPatient(socket);
  receiveMessage(socket);
});

app.get('/test', function(req, res){
  res.send('hello world');
});


http_srv.listen(3000, '0.0.0.0', function(err){
  if (err) {
    console.log(err);
    return;
  }
  console.log('listening on 0.0.0.0:3000');
});

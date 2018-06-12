import React, { Component } from 'react';
import {
    Label,
    Input,
    Container,
    Button,
    Row,
    Col,
} from 'reactstrap';
import openSocket from 'socket.io-client';
var hashjs = require('hash.js');


class App extends Component {
  constructor() {
    super()

    this.state = {
      endpoint: "http://localhost:3000" // this is where we are connecting to with sockets
    };
    console.log('Called constructor')
  }

  authUser(){
      const  socket = openSocket(this.state.endpoint);
      socket.on('doctors_auth_salt', function(client_data){
          const hashpass = hashjs.sha256(client_data.salt+this.password).update().digest('hex');
          socket.emit('doctors_auth_pass', {password:hashpass})
      });

      socket.on('auth_result', function(client_data){
          console.log('Auth_result');
          console.log(client_data);
      });
      console.log(this.ssn);
      socket.emit('doctors_auth_init', {ssn:this.ssn});
  }

  render() {
    return (
      <Container>
      <Row>
        <Col body className="text-center">
          <h1>Welcome to MedChat platform</h1>
        </Col>
      </Row>
      <Row/>
      <Row>
        <Col/>
        <Col>
            <Label for="SSN">Social security number</Label>
            <Input id="SSN" onChange={(e) => this.ssn=`${e.target.value}`} placeholder="Enter your SSN here" />
            <Label for="password">Password</Label>
            <Input type="password" id="password" onChange={(e) => this.password=`${e.target.value}`} placeholder="Enter your password here" />
            <Button type="submit" color="primary" onClick={this.authUser.bind(this)}>Submit</Button>
          </Col>
          <Col/>
        </Row>
      </Container>
    )
  }
}

export default App;

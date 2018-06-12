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
//var hashjs = require('hash.js');
var CryptoJS = require("crypto-js");

class App extends Component {
  constructor() {
    super()

    this.state = {
      credentials:{
        password: null,
        ssn: null
      }
    };
    console.log('Called constructor')
  }

  authUser(){
      const  socket = openSocket("http://localhost:3000");
      const state = this.state;
      socket.on('doctors_auth_salt', function(client_data){
          console.log(client_data.salt+state.credentials.password);
          const hashpass = CryptoJS.SHA256(client_data.salt+state.credentials.password).toString(CryptoJS.enc.Hex);
          const to_send= {ssn: state.credentials.ssn, hash:hashpass};
          socket.emit('doctors_auth_pass', to_send)
      });

      socket.on('auth_result', function(client_data){
        console.log(client_data);
      });

      socket.emit('doctors_auth_init', {ssn:this.state.credentials.ssn});
  }


  handleChange(e){
    const state = this.state;
    state.credentials[e.target.name] = e.target.value;
    this.setState(state);
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
            <Label for="ssn">Social security number</Label>
            <Input name="ssn" onChange={this.handleChange.bind(this)} placeholder="Enter your SSN here" />
            <Label for="password">Password</Label>
            <Input type="password" name="password" onChange={this.handleChange.bind(this)} placeholder="Enter your password here" />
            <Button type="submit" color="primary" onClick={this.authUser.bind(this)}>Submit</Button>
          </Col>
          <Col/>
        </Row>
      </Container>
    )
  }
}

export default App;

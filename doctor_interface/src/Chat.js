import React, { Component } from 'react';
import { ChatFeed, Message } from 'react-chat-ui'
import {
    ListGroup,
    ListGroupItem,
    InputGroup,
    InputGroupAddon,
    Input,
    Container,
    Row,
    Col,
    Button
} from 'reactstrap';
import openSocket from 'socket.io-client';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_typing:false,
      font_size:20,
      messages: [
        new Message({id: 1, name:'Patient0', message: "I'm the recipient! (The person you're talking to)",}), // Gray bubble
        new Message({id: 1, message: "I'm the recipient! (The person you're talking to)",}), // Gray bubble
        new Message({id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
      ],
      patients: [
        {name:'123', ssn:'123123'},
        {name:'123', ssn:'1231s23'},
        {name:'123', ssn:'1231d23'},
        {name:'123', ssn:'123dd123'},
        {name:'123', ssn:'12317238423'},
        {name:'123', ssn:'1231s23'},
        {name:'123', ssn:'1231fsas23'},
        {name:'123', ssn:'1231dasdawe23'},
        {name:'123', ssn:'123dd12asd3'},
        {name:'123', ssn:'123172sds38423'},

      ],
      api_key:props.api_key,
      user_id:props.user_id
    };
    this.retrieveUsers();
  }

  retrieveUsers(){
      const socket = openSocket("http://localhost:3000");
      const state = this.state;
      const to_send =  {api_key:state.api_key, user_id:state.user_id};

      socket.on('doc_receive_patients', function(patients_list){
        console.log(patients_list);
      })
      socket.emit('doc_request_patients',to_send);
  }

  render() {
    const patients = this.state.patients;
    return(
      <Container >
        <Row>
          <Col xs={{size:3}} style={{height:"70vh"}}>
          <h5> Patients List:</h5>
            <ListGroup>
              {patients.map(function(patient, index){
                return <ListGroupItem key={patient.ssn} >{patient.name} / {patient.ssn}</ListGroupItem>
              })}
            </ListGroup>
          </Col>
          <Col>
              <h5> Chat feed:</h5>
              <ChatFeed
                messages={this.state.messages} // Boolean: list of message objects
                isTyping={this.state.is_typing} // Boolean: is the recipient typing
                hasInputField={false} // Boolean: use our input, or use your own
                showSenderName // show the name of the user who sent the message
                bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
              />
          </Col>
        </Row>
        <Row>
          <Col>
          <InputGroup style={{paddingTop:20}}>
            <Input placeholder="Type here..." />
            <InputGroupAddon addonType="append">
              <Button color="primary" >Send</Button>
            </InputGroupAddon>
          </InputGroup>
          </Col>
        </Row>
      </Container>

    )
  }

}

export default Chat;

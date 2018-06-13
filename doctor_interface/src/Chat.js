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

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      is_typing:false,
      font_size:20,
      messages: [
        new Message({id: 1, message: "I'm the recipient! (The person you're talking to)",}), // Gray bubble
        new Message({id: 1, message: "I'm the recipient! (The person you're talking to)",}), // Gray bubble
        new Message({id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
      ],
      patients: [
        {name:'123', ssn:'123123'},
        {name:'123', ssn:'1231s23'},
        {name:'123', ssn:'1231d23'},
        {name:'123', ssn:'123dd123'},
        {name:'123', ssn:'12317238423'},

      ],
    };
  }

  render() {
    const patients = this.state.patients;
    return(
      <Container>
        <Row>
          <Col xs={{size:3}}>
            <ListGroup>
              {patients.map(function(patient, index){
                return <ListGroupItem key={patient.ssn} >{patient.name} / {patient.ssn}</ListGroupItem>
              })}
            </ListGroup>
          </Col>
          <Col>
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
          <InputGroup>
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

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
      messages: {},
      patients: [],
      api_key:props.api_key,
      user_id:props.user_id,
      selected:0
    };
    this.retrieveUsers();
    this.handleUserChage = this.handleUserChage.bind(this);
    this.handleMessageSend = this.handleMessageSend.bind(this)
  }

  retrieveUsers(){
      const socket = openSocket("http://lext-devbox:3000");
      const state = this.state;
      const component = this;
      const to_send =  {api_key:state.api_key, user_id:state.user_id};

      socket.on('doc_receive_patients', function(srv_data){
        if (srv_data.err === 0) {
          let new_state = {api_key:state.api_key, user_id:state.user_id, patients:srv_data.patients_list, selected:0}
          const msg_socket = openSocket("http://lext-devbox:3000");
          msg_socket.on('doc_receive_message', function(msg){
              console.log(msg);
          });
          new_state.msg_socket =  msg_socket
          component.setState(new_state);
        }
      })
      socket.emit('doc_request_patients',to_send);
  }

  handleUserChage(e) {
    const list_index = Number(e.currentTarget.attributes.listid.value);
    const state = this.state;
    const new_state = {api_key:state.api_key, user_id:state.user_id, patients:state.patients, selected:list_index, msg_socket:state.msg_socket}
    this.setState(new_state);
  }

  handleMessageSend(e) {
    e.preventDefault();
    const state = this.state;
    const pat_index = state.selected;
    const patient = state.patients[pat_index];
    const api_key = state.api_key;
    const uid = state.user_id;
    const text = 'test text';
    if (patient.appointment_happening === false) return;
    const to_send = {api_key:api_key, user_id:uid, patient_id:patient.patient_id, appointment:patient.appointment_id, text:text}
    console.log(patient);
    this.state.msg_socket.emit('srv_receive_message_doc', to_send);

  }

  render() {
    const patients = this.state.patients;
    const state=this.state;
    const handleUserChage = this.handleUserChage;
    const list_items = patients.map(function(patient, index){
      const display=patient.patient_name + " "+ patient.patient_surname + ' / '+ patient.patient_ssn;
      return <ListGroupItem
              active={index===state.selected ? true: false}
              action
              listid={index}
              key={index}
              onClick={handleUserChage.bind(this)}>{display}</ListGroupItem>
    });

    var msg_display=[];
    if (typeof patients[state.selected] !== "undefined") {
      if (typeof patients[state.selected].message_history !== "undefined"){
        const msgs = patients[state.selected].message_history;
        for (let i=0; i < msgs.length;i++){
          const msg = msgs[i];
          msg_display.push(new Message({id: msg.from === state.user_id ? 0 : 1, message: msg.text}));
        }
      };
    };

    return(
      <Container >
        <Row>
          <Col xs={{size:4}} style={{height:"70vh"}}>
          <h5> Patients List:</h5>
            <ListGroup>
              {list_items}
            </ListGroup>
          </Col>
          <Col>
              <h5> Chat feed:</h5>
              <ChatFeed
                messages={msg_display} // Boolean: list of message objects
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
              <Button color="primary" onClick={this.handleMessageSend}>Send</Button>
            </InputGroupAddon>
          </InputGroup>
          </Col>
        </Row>
      </Container>

    )
  }

}

export default Chat;

import React, { Component} from 'react';
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
import ReactDOM from 'react-dom'

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_typing:false,
      font_size:17,
      messages: {},
      patients: [],
      api_key:props.api_key,
      user_id:props.user_id,
      selected:undefined,
      msg_socket:props.msg_socket,
      curr_msg:undefined
    };
    this.retrieveUsers();
    this.handleUserChage = this.handleUserChage.bind(this);
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.renderChat = this.renderChat.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    //registering the callback on receiving the new message
    const component = this;
    this.state.msg_socket.on('doc_receive_message', function(msg){
        const new_state = component.state;
        if (typeof new_state.patients[msg.appointment_id] === "undefined"){
            new_state.patients[msg.appointment_id].message_history = [msg];
        } else {
            new_state.patients[msg.appointment_id].message_history.push(msg);
        }

        component.setState(new_state);
    });

  }

  retrieveUsers(){
      //const socket = openSocket("http://lext-devbox:3000");
      const socket = openSocket("http://localhost:3000");
      const state = this.state;
      const component = this;
      const to_send =  {api_key:state.api_key, user_id:state.user_id};

      socket.on('doc_receive_patients', function(srv_data){
        if (srv_data.err === 0) {
          var apppointments_list = {};
          // COnverting the received data to teh key-value format
          srv_data.apppointments_list.forEach((el)=>{apppointments_list[el.appointment_id]=el});
          let new_state = {api_key:state.api_key, user_id:state.user_id, patients:apppointments_list, selected:0}
          component.setState(new_state);
        }
      })
      socket.emit('doc_request_patients',to_send);
  }

  handleUserChage(e) {
    const list_index = e.currentTarget.attributes.listid.value;
    const state = this.state;
    const new_state = {api_key:state.api_key, user_id:state.user_id, patients:state.patients, selected:list_index, msg_socket:state.msg_socket, curr_msg:null}
    this.setState(new_state);
  }

  handleMessageSend(e) {
    e.preventDefault();
    const state = this.state;
    const pat_index = state.selected;
    const patient = state.patients[pat_index];
    if (typeof patient === "undefined") return;
    const api_key = state.api_key;
    const uid = state.user_id;
    if (patient.appointment_happening === false) return;
    const curr_msg =  this.message_input.state.value;
    if (curr_msg !== '' && typeof curr_msg !== "undefined"){
      const to_send = {api_key:api_key, doc_id:uid, patient_id:patient.patient_id, appointment_id:patient.appointment_id, text:curr_msg}
      this.state.msg_socket.emit('srv_receive_message_doc', to_send);
      this.message_input.setState({value:""});
      ReactDOM.findDOMNode(this.message_input).value = "";
    }
  }

  handleInputChange(e){
    this.message_input.setState({value: e.target.value});
  }

  renderChat(msg_display){
    if (typeof this.state.selected !== "undefined"){
        return <ChatFeed
          messages={msg_display} // Boolean: list of message objects
          isTyping={this.state.is_typing} // Boolean: is the recipient typing
          hasInputField={false} // Boolean: use our input, or use your own
          showSenderName // show the name of the user who sent the message
          bubblesCentered={false}
          bubbleStyles={
            {
              text: {
                fontSize: this.state.font_size
              },
              chatbubble: {
                borderRadius: 20,
                padding: 7
              }
            }
          }
        />;
    };
    return null;
  }

  render() {
    const patients = this.state.patients;
    const state=this.state;
    const handleUserChage = this.handleUserChage;
    const list_items = Object.keys(patients).map(function(appointment_id, index){
      const patient=patients[appointment_id];
      const display=patient.patient_name + " "+ patient.patient_surname + ' / '+ patient.patient_ssn;
      return <ListGroupItem
              active={appointment_id===state.selected ? true: false}
              action
              listid={appointment_id}
              key={appointment_id}
              onClick={handleUserChage.bind(this)}>{display}</ListGroupItem>
    });

    var msg_display=[];
    if (typeof patients[state.selected] !== "undefined") {
      if (typeof patients[state.selected].message_history !== "undefined"){
        const msgs = patients[state.selected].message_history;
        for (let i=0; i < msgs.length;i++){
          const msg = msgs[i];
          msg_display.push(new Message({id: msg.from === 'doc' ? 0 : 1, message: msg.text}));
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
            <div style={{overflowY:'scroll', height:'500px', display:'flex', flexDirection:'column-reverse'}}>
              {this.renderChat(msg_display)}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
          <InputGroup style={{paddingTop:20}}>
            <Input name="msg_input"
                   onChange={this.handleInputChange}
                   ref={ref => this.message_input=ref} value={this.state.value}
                   placeholder="Type here..." />

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

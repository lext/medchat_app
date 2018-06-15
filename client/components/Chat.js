import { GiftedChat } from 'react-native-gifted-chat';
import React, { Component } from 'react';
import SocketIOClient from 'socket.io-client';

class Chat extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      appointment:props.appointment,
      connection:props.authState()
    }

  }

  componentDidMount(){
    const connection = this.state.connection;
    const component = this;
    const appointment = this.state.appointment;
    var messages_state = appointment.message_history;
    // Modifying the received history in order to display them correctly
    for (let i=0; i < messages_state.length; i++){
      const msg = messages_state[i];
      messages_state[i].user = {_id: msg.from === 'doc' ? 2: 1,
                          name:msg.from === 'doc' ? appointment.doc_name : appointment.patient_name};
    }

    // Creating a new state to render the history
    var new_state = {messages: messages_state,
                    appointment:appointment,
                    connection:connection}
    component.setState(new_state);
    // Now we wait for the new messages
    connection.msg_socket.on('pat_receive_message', function(msg) {
      var new_msg = msg;
      // When the new message comes, we just update the current state
      new_msg.user = {_id: msg.from === 'doc' ? 2: 1,
                      name:msg.from === 'doc' ? appointment.doc_name : appointment.patient_name};
      component.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, new_msg),
      }))
    });
  }

  onSend(msg) {
    // Sends the message
    const state = this.state;
    const appointment = state.appointment;
    // check whether the appointment is ongoing
    // this can be handled by the server
    // at the momemnt it is just a flag, but in real life,
    // it should have been made better
    if(appointment.appointment_happening !== true) return;
    // GiftedChat sends a list here, however, we take only the 0 message
    const text = msg[0].text;
    // connection is coming from the parent component
    // it has the socket and the api_key
    const connection = this.state.connection;
    const socket = connection.msg_socket;
    const to_send = {api_key:connection.api_key,
                     doc_id:appointment.doc_id,
                     patient_id:appointment.patient_id,
                     appointment_id:appointment.appointment_id,
                     text:text};
    socket.emit('srv_receive_message_pat', to_send);
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={msg => this.onSend(msg)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}

export default Chat;

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
} from 'react-native';
import  Header from 'react';
import { Actions } from 'react-native-router-flux';
import SocketIOClient from 'socket.io-client';

class ChatList extends Component {
  constructor(props){
    super(props)
    this.state={
      chats: [],
      connection:props.authState()
    };

    //const socket = SocketIOClient("http://lext-devbox:3000");
    const socket = SocketIOClient("http://localhost:3000");
    socket.connect();
    const component = this;
    socket.on('pat_receive_appointments', function(appointments_data){
      if (appointments_data.err == 0){
        const new_state = component.state;
        var chats_past = [];
        var chat = []
        const appointments = appointments_data.apppointments_list;
        for(let i = 0; i < appointments.length;  i++){
          let appnt = appointments[i];
          appnt.key = appnt.appointment_id;
          chats_past.push(appnt);
        };
        new_state.chats = chats_past;
        component.setState(new_state);
      } else{
        console.log('error happened during receiving patients list');
      }
    });
    const to_send={api_key:this.state.connection.api_key,
             user_id:this.state.connection.user_id};
    socket.emit('pat_request_patients', to_send);

  }

  handlePress(item) {
    Actions.chat({appointment:item});
    Actions.refresh({title: "Chat with "+item.doc_name + ' ' + item.doc_surname});
  }

  render() {
    const name_show = 'test';//this.state.connection.patient_name;
    console.log(name_show);
    return (
      <View>
        <FlatList
          data={this.state.chats}
          renderItem={
            ({item}) =>
              <Text style={styles.item}
                    onPress={this.handlePress.bind(this, item)}>
                {item.doc_specialization + ' / ' + item.doc_name + ' ' + item.doc_surname}
              </Text>
          }
        />
      </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

export default ChatList;

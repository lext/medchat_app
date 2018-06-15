import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import SocketIOClient from 'socket.io-client';

class ChatList extends React.Component {
  constructor(props){
    super(props)
    this.state={
      chats: [],
      connection:props.authState();
    };

    const socket = SocketIOClient("http://lext-devbox:3000");
    socket.connect();

  }

  handlePress(item) {
    Actions.chat({user:item});
    Actions.refresh({title: "Chat with "+item.key});
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.chats}
          renderItem={
            ({item}) =>
              <Text style={styles.item}  onPress={this.handlePress.bind(this, item)}>
                {item.key}
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

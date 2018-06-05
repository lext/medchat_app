/**
Client app which is using GiftedChat to connect to the server
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import Chat from './components/Chat.js';
import SocketIOClient from 'socket.io-client';

class App extends Component{
  constructor(props) {
    super(props);
    this.socket = SocketIOClient('http://localhost:3000');
  }

  render() {
    return (
      <Chat/>
    )
  }
}

export default App;

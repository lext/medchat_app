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
import SocketIOClient from 'socket.io-client';
import { Router, Scene } from 'react-native-router-flux';

import Chat from './components/Chat.js';
import Home from './components/Home.js';

class App extends Component{
  constructor(props) {
    super(props);
    this.socket = SocketIOClient('http://localhost:3000');
  }

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="home"
            component={Home}
            hideNavBar={true}
            initial
          />
          <Scene
            key="chat"
            component={Chat}
            title="Chat"
          />
        </Scene>
      </Router>
    )
  }
}

export default App;

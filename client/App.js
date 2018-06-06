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
import ChatList from './components/ChatList.js';
import Home from './components/Home.js';

class App extends Component{
  constructor(props) {
    super(props);

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
            key="chatlist"
            component={ChatList}
            hideNavBar={true}
            title="Chats"
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

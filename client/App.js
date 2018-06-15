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
    this.state = {
    }
    this.handleAuth = this.handleAuth.bind(this);
   }

  handleAuth(auth_socket, auth_result){
    if (auth_result.auth_code === 1) {
      console.log(auth_result);
      this.setState({api_key: auth_result.api_key, user_id:auth_result.user_id, msg_socket:auth_socket});
    }
  }

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="home"
            component={Home}
            hideNavBar={true}
            handleAuth={this.handleAuth}
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

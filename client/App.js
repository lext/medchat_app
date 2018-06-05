/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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

class App extends Component{

  render() {
    return (
      <Chat/>
    )
  }
}

export default App;

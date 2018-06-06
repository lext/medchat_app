import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ImageBackground
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { YellowBox } from 'react-native';
import SocketIOClient from 'socket.io-client';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);



class Home extends React.Component {
  signUp() {
  };

  confirmUser() {
    this.socket = SocketIOClient('http://localhost:3000');
    Actions.chatlist();
  };

  onChangeText(value) {


  };

  render () {
    return (
      <ImageBackground source={require('../assets/background.jpg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.input}>
            <TextInput
              placeholder='Social security number'
              onChangeText={value => this.onChangeText(value)}
            />
            <TextInput
              placeholder='Password'
              onChangeText={value => this.onChangeText(value)}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.button_container}>
            <Button
              title='Login'
              onPress={this.confirmUser.bind(this)}
            />
          </View>
        </View>
      </ImageBackground>
  );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 100,
    marginHorizontal: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: '#F5FCFF'
  },
  button_container: {
    marginHorizontal: 20,
    marginVertical: 5
  },
  backgroundImage: {
      flex: 1,
      width: undefined,
      height: undefined,
  }
});

export default Home;

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
import { sha256 } from 'react-native-sha256';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


class Home extends React.Component {

  confirmUser() {
    // Initializing the socket if it is not yet initialized
    if (typeof this.socket == "undefined"){
      console.log('Trying to connect to the server')
      this.socket = SocketIOClient("http://lext-devbox:3000");
      this.socket.connect();
    }
    // This should happen if the server will approve the authentication
    this.socket.on('auth_result', (data)=> {
      if (data.auth_code == 1) {
          Actions.chatlist();
      }
    });

    this.socket.on('patients_auth_salt', (data)=> {
      sha256(data.salt+this.pass).then( hash_res => {
        this.socket.emit('patients_auth_pass', {ssn:this.login, hash: hash_res});
      })
    });

    // Sending the login and the password
    this.socket.emit('patients_auth_init', {ssn:this.login, pass:this.pass});

  };

  onChangeLogin(value) {
    this.login = value
  };

  onChangePass(value) {
    this.pass = value
  };

  render () {
    return (
      <ImageBackground source={require('../assets/background.jpg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.input}>
            <TextInput
              placeholder='Social security number'
              onChangeText={value => this.onChangeLogin(value)}
            />
            <TextInput
              placeholder='Password'
              onChangeText={value => this.onChangePass(value)}
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

import { GiftedChat } from 'react-native-gifted-chat';
import React, { Component } from 'react';

class Chat extends React.Component {
  state = {
    messages: [
    ],
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}

export default Chat;

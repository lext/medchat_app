import React, { Component } from 'react';
import Auth from './Auth'
import Chat from './Chat'
class App extends Component {
  constructor() {
    super()

    const state = {
      display_current: 'CHAT',
    };

    this.state = state;
  }

  handleAuth(auth_result){
    if (auth_result.auth_code === 1) {
      this.setState({display_current:'CHAT'});
    }
  }

  render() {
    switch (this.state.display_current){
        case 'AUTH':
          return(<Auth auth_callback={this.handleAuth.bind(this)}/>);
          break;
        case 'CHAT':
          return(<Chat />);
          break;
        default:
          return(<Auth auth_callback={this.handleAuth.bind(this)}/>);
          break;

    }

  }
}

export default App;

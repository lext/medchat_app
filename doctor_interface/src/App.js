import React, { Component } from 'react';
import Auth from './Auth'

class App extends Component {
  constructor() {
    super()

    const state = {
      display_current: 'AUTH',
    };

    this.state = state;
  }

  handleAuth(auth_result){
    console.log(auth_result);
  }

  render() {
    return(
      <Auth auth_callback={this.handleAuth.bind(this)}/>
    )
  }
}

export default App;

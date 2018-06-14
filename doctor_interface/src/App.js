import React, { Component } from 'react';
import Auth from './Auth'
import Chat from './Chat'
import './App.css'

const Header = ({title}) => (<header id="app-header"><h4>{title}</h4></header>);
const Footer = ({title}) => (<footer id="app-footer">{title}</footer>);

class App extends Component {
  constructor() {
    super()

    const state = {
      display_current: 'AUTH',
      api_key:null,
      user_id:null,
      msg_socket:null
    };

    this.state = state;
  }
  
  handleAuth(auth_socket, auth_result){
    if (auth_result.auth_code === 1) {
      this.setState({display_current:'CHAT', api_key: auth_result.api_key, user_id:auth_result.user_id, msg_socket:auth_socket});
    }
  }

  renderSwitch() {
    switch(this.state.display_current) {
      case 'AUTH':
        return <Auth auth_callback={this.handleAuth.bind(this)} />;
      case 'CHAT':
        return <Chat msg_socket={this.state.msg_socket} api_key={this.state.api_key} user_id={this.state.user_id}/>;
      default:
        return <Auth auth_callback={this.handleAuth.bind(this)}/>;
    }
  }

  render() {
    return(
      <div id="app-container">
        <Header title="MedChat app [doctor's interface]" />
          <div id="app-content">
            {this.renderSwitch()}
          </div>
        <Footer title='(c) Aleksei Tiulpin, 2018' />
      </div>
    );
  }
}




export default App;

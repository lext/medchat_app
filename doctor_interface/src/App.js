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
      display_current: 'CHAT',
      api_key:null
    };

    this.state = state;
  }
  handleAuth(auth_result){
    if (auth_result.auth_code === 1) {
      this.setState({display_current:'CHAT', api_key: auth_result.api_key});
    }
  }

  renderSwitch() {
    switch(this.state.display_current) {
      case 'AUTH':
        return <Auth auth_callback={this.handleAuth.bind(this)} />;
      case 'CHAT':
        return <Chat />;
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

import React, { Component } from 'react';
import Auth from './Auth'
import Chat from './Chat'


const styles={
  header:{
    display: "block",
    color: "white",
    background: "#4286f4",
    padding:20,
    width:"100%"
  },
  container:{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minHeight: "100%",
  },
  footer:{
    display: "flex",
    width:"100%",
    color: "white",
    background: "#4286f4",
    padding:20,
    width:"100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

};

const Header = ({title}) => (<header style={styles.header}>{title}</header>);
const Footer = ({title}) => (<footer style={styles.footer}>{title}</footer>);

class App extends Component {
  constructor() {
    super()

    const state = {
      display_current: 'AUTH',
    };

    this.state = state;
  }

  componentDidMount(){
    document.body.height="100%";
  }

  handleAuth(auth_result){
    if (auth_result.auth_code === 1) {
      this.setState({display_current:'CHAT'});
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
      <div style={styles.container}>
        <Header title='MedChat app' />
          {this.renderSwitch()}
        <Footer title='(c) Aleksei Tiulpin, 2018' />
      </div>
    );
  }
}




export default App;

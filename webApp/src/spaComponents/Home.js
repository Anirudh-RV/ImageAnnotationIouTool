import React, { Component } from 'react';
import logo from './logo.svg';
import '../cssComponents/App.css';
import IntroBar from './introBar'

class Home extends Component {
//TODO : ADD INTRODUCTION TO PROJECT
  render() {
    return (
      <div className="App">
      <IntroBar/>
      <h1>Annotation Tool</h1>
      </div>
    );
  }
}
export default Home;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import Cookies from 'universal-cookie';

class TestAPI extends Component {
//TODO : ADD INTRODUCTION TO PROJECT

componentDidMount(){
// OnLoad function
  const cookies = new Cookies()

  if(cookies.get('username')){
    this.DataRetrieved.innerHTML = cookies.get('username')
  }else{
    console.log("No cookie")
  }
}

testmakecookie = () =>{
  const cookies = new Cookies()
  cookies.set('username', 'Pacman', { path: '/' })
  console.log(cookies.get('username'))
  this.DataRetrieved.innerHTML = cookies.get('username')
}

testdeletecookie = () =>{
  const cookies = new Cookies()
  cookies.remove('username');
}

render() {
    return (
      <div className="App">
      <h1>TESTING Cookies, check developer tools for console.</h1>
      <pre>

      </pre>
      <button type="button" class="btn btn-success btn-block" onClick={this.testmakecookie}> MAKE COOKIE </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testdeletecookie}> DELETE COOKIE </button>
      <h1 className='name' ref = {c => this.DataRetrieved = c}></h1>
      </div>

    );
  }
}
export default TestAPI;

import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";
import {FormGroup, FormControl} from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

class Signin extends Component {
//TODO : ADD Footer information
// http://localhost:
handleSubmit = () =>{
  var data = this.usercredentials.value+","+this.Password.value
  axios.post("http://localhost:8080/authorizeuser",data)
    .then(res => { // then print response status
      if(res.data["message"] == "No"){
        this.Error.innerHTML = "UserName or Password incorrect."
      }else{
        const cookies = new Cookies()
        cookies.set('username',this.usercredentials.value, { path: '/' })
        this.props.history.push({
          pathname: '/customrouting',
          state: {usercredentials: this.usercredentials.value, checkval : res.data["message"]}
        })
      }
    })
    .catch(err => { // then print response status
    //  toast.error('upload fail')
    console.log(err)
    })
}

  render() {
    return (
      <div className = "BackgroundSign">
      <h1 className = "AppName" >End-to-end data curation and annotation platform</h1>
      <div className="SignIn">
        <form onSubmit={this.handleSubmit}>
        <p class = "SignInHead">X-P1</p>
        <p class = "SignUpHead">Sign In to make data collection and image annotation easier.</p>
          <FormGroup controlId="email" bsSize="large">
            <FormControl
              autoFocus
              placeholder="Username, or email"
              ref = {c => this.usercredentials = c}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <FormControl
              placeholder="Password"
              ref = {c => this.Password = c}
              type="password"
            />
          </FormGroup>
          <Button block bsSize="large" onClick={this.handleSubmit} type="button">
            Log In
          </Button>
          <br/>
          <p className = "ErrorMessage" ref = {c => this.Error = c}></p>
        </form>
      </div>
      <div className="SecondBoxSignIn">
        <p className = "LinkToAccount"> Don't have an account?&nbsp;
          <Link className="LinkToSignUp" to = './signup'>Sign up</Link>
        </p>
      </div>
      </div>
    );
  }
}
export default Signin;

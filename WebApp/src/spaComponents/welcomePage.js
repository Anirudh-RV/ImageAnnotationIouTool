import React, { Component } from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import '../cssComponents/App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";
import {FormGroup, FormControl} from "react-bootstrap";
import { Link } from 'react-router-dom';

class welcomePage extends Component {

componentDidMount(){
// OnLoad function
// if counter exceeds 5, then stop process
this.heading.innerHTML = this.props.location.state.userName+"</br>Annotation Tool";
this.nodeServerUrl = "http://localhost:4000"
this.goApiUrl = "http://localhost:8080"
this.pythonBackEndUrl = "http://localhost:8000"
}

UploadVideo = () =>{
  var userName = this.props.location.state.userName;
  this.props.history.push({
    pathname: '/DownloadVideoComponent',
    state: {userName: this.props.location.state.userName}
})
}

StartAnnotation = () =>{
  var userName = this.props.location.state.userName;
  this.props.history.push({
    pathname: '/upload',
    state: {userName: this.props.location.state.userName}
})
}

Logout = () =>{
    const cookies = new Cookies()
    cookies.remove('username');
    window.location.reload(false);
}


render() {
    return (
      <div className = "BackgroundSign">
      <h1 className = "AppName" ref = {c => this.heading = c}></h1>
      <div className="SignIn">
        <form>
        <p class = "SignInHead">Annotation Tool</p>
        &nbsp;

          <FormGroup controlId="url" bsSize="large">
          <Button className="StartButton" block bsSize="large" onClick={this.StartAnnotation} type="button">
            Upload Images
          </Button>
          </FormGroup>

          <FormGroup controlId="url" bsSize="large">
          <Button className="StartButton" block bsSize="large" onClick={this.UploadVideo} type="button">
            Upload Videos
          </Button>
          </FormGroup>

          <br/>
          <p className = "ErrorMessage" ref = {c => this.Message = c}></p>
        </form>
      </div>
      <div className="SecondBoxSignIn" ref = {c => this.Info = c}>
        <p className = "LinkToAccount"> Click here when done &nbsp;
          <Link className="LinkToSignUp" onClick={this.Logout}>LOGOUT</Link>
        </p>
      </div>
      </div>
    );
  }
}

export default welcomePage;

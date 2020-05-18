import React, { Component } from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";
import {FormGroup, FormControl} from "react-bootstrap";
import { Link } from 'react-router-dom';

class DownloadVideoComponent extends Component {

componentDidMount(){
// OnLoad function
// if counter exceeds 5, then stop process
this.heading.innerHTML = this.props.location.state.userName+"</br>Start Your Data Science Jounrney with AppName";
this.buttonpressed = 0;
this.counter = 0;
this.nodeserverurl = "http://localhost:4000"
this.goapiurl = "http://localhost:8080"
this.pythonbackendurl = "http://localhost:8000"
}

dividetheframes = () =>{
  var username = this.props.location.state.userName
  var videoname =  this.videoname.value
  var imagetype = 'jpeg'
  var videourl = this.nodeserverurl+'/videos/'+username+'/downloads/'+videoname+'.mp4'
  var low = '1'
  var high = '5'
  var data = {'username':username,'videoname':videoname,'videourl':videourl,'imagetype':imagetype,'low':low,'high':high}
  console.log("inside the testdjangoapi function : ")
  axios.post(this.pythonbackendurl+"/dividetheframes/",data)
    .then(res => { // then print response status
      //toast.success('upload success')
      console.log("API message : ")
      console.log(res)
      console.log(res.data["message"])
      if(this.DataRetrieved) {
       this.DataRetrieved.innerHTML = res.data["message"];
    }
    this.gotoeditpage();
    })
    .catch(err => { // then print response status
    //  toast.error('upload fail')
    console.log("fail")
    console.log(err)
    })
}

wait = (ms) =>{
var d = new Date();
var d2 = null;
do { d2 = new Date(); }
while(d2-d < ms);
}

gotoeditpage = () =>{
  var userName = this.props.location.state.userName;
  this.props.history.push({
    pathname: '/EditPage',
    state: {userName: this.props.location.state.userName}
})
}

handleSubmit = () =>{
  this.Message.innerHTML = "The process may take a few minutes..."
  axios.post(this.nodeserverurl+"/download/",{
    username : this.props.location.state.userName,
    videoname : this.videoname.value,
    videourl : this.videourl.value,
  })
    .then(res => { // then print response status
      //toast.success('upload success')
      console.log(res)
      this.Message.innerHTML = "Download complete..."

    })
    .catch(err => {
    // then print response status
    //  toast.error('upload fail')
    console.log("fail")
    console.log(err)
    })
}

render() {
    return (
      <div className = "BackgroundSign">
      <h1 className = "AppName" ref = {c => this.heading = c}></h1>
      <div className="SignIn">
        <form onSubmit={this.handleSubmit}>
        <p class = "SignInHead">Annotation Tool</p>
        <p class = "SignUpHead">Begin the data gathering process with just a few steps.</p>
        &nbsp;
          <FormGroup controlId="url" bsSize="large">
            <FormControl
              autoFocus
              placeholder="Enter the url of the youtube video"
              ref = {c => this.videourl = c}
            />
          </FormGroup>

          <FormGroup controlId="url" bsSize="large">
            <FormControl
              autoFocus
              placeholder="Enter the name of the video"
              ref = {c => this.videoname = c}
            />
          </FormGroup>

          <Button className="StartButton" block bsSize="large" onClick={this.handleSubmit} type="button">
            Download
          </Button>

          <Button className="StartButton" block bsSize="large" onClick={this.dividetheframes} type="button">
            Start Annotation
          </Button>

          <br/>
          <p className = "ErrorMessage" ref = {c => this.Message = c}></p>
        </form>
      </div>
      <div className="SecondBoxSignIn" ref = {c => this.Info = c}>
        <p className = "LinkToAccount"> Download complete and not redirecting?Click here&nbsp;
          <Link className="LinkToSignUp" onClick={this.dividetheframes}>Redirect</Link>
        </p>
      </div>
      </div>
    );
  }
}

export default DownloadVideoComponent;

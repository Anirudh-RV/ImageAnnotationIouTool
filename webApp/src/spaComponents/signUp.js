import React, { Component } from 'react';
import '../cssComponents/App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";
import {FormGroup, FormControl} from "react-bootstrap";
import { Link } from 'react-router-dom';
import introBar from './introBar';
import axios from 'axios';
import Cookies from 'universal-cookie';

class SignUp extends Component {
//TODO : ADD Footer information

componentDidMount(){
// OnLoad function
this.accountexists = false;
this.userNameExists = false;
this.handleEmail.bind(this);

this.nodeServerUrl = "http://localhost:4000"
this.goApiUrl = "http://localhost:8080"
this.pythonBackEndUrl = "http://localhost:8000"
}

//addusertodatabase
signUpUser = () =>{
    var email = this.emailId.value;
    var userName = this.userName.value;
    var fullName = this.fullName.value;
    var Password = this.Password.value;
    var data = email+","+userName+","+fullName+","+Password
    axios.post(this.goApiUrl+"/addusertodatabase",data)
      .then(res => { // then print response status
        const cookies = new Cookies()
        cookies.set('userName',this.userName.value, { path: '/' })
        // redirect to CustomRouting with data
        this.props.history.push({
          pathname: '/customRouting',
          state: {userCredentials: userName,checkval : res.data["message"]}
      })
      })
      .catch(err => { // then print response status
      console.log(err)
      })

}

len = (checkvar) => {
  return checkvar.length;
}

validateEmail = (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

checkForExistingUserName = (field,value) =>{
  var data = field+","+value;
  axios.post(this.goApiUrl+"/validateinfo",data)
    .then(res => { // then print response status
      if(res.data["message"] == "Yes"){
        // existing emailID
        this.userNameError.innerHTML = "userName already taken, please try another.";
      }
      else{
        // EmailID,userName,fullName,Password : good
        // call signUpUser
        this.signUpUser();
      }
    })
    .catch(err => { // then print response status
    console.log(err)
    })
}

checkForExistingEmail = (field,value,userName) =>{
  var data = field+","+value;
  axios.post(this.goApiUrl+"/validateinfo",data)
    .then(res => { // then print response status
      if(res.data["message"] == "Yes"){
        // existing emailID
        this.emailError.innerHTML = "Already existing email, do you want to login?";
      }
      else{
        // EmailID is good, check for userName
        this.checkForExistingUserName("userName",userName);
      }

    })
    .catch(err => { // then print response status
    console.log(err)
    })
}

handleEmail = (email,flag) => {
  if(this.validateEmail(email)){
  this.emailError.innerHTML = "";

  // check for exisiting emailId
  }
  else{
    flag = false;
    this.emailError.innerHTML = "Invalid emailId";
  }
  return flag;
}

handleuserName = (userName,flag) => {
  if(this.len(userName)>=4){
  this.userNameError.innerHTML = "";
  }
  else{
    flag = false;
    this.userNameError.innerHTML = "Invalid userName";
  }
  return flag;
}

handlefullName = (fullName,flag) => {
  if(this.len(fullName)!=0){
  this.fullNameError.innerHTML = "";
  }
  else{
    flag = false;
    this.fullNameError.innerHTML = "Please fill your name";
  }
  return flag;
}

handlePassword = (Password,flag) => {
  if(this.len(Password)>=6){
  this.PasswordError.innerHTML = "";
  }
  else{
    flag = false;
    console.log("fullName Error");
    this.PasswordError.innerHTML = "Password too weak";
  }
  return flag;
}

handleSubmit = () =>{
  var email = this.emailId.value;
  var userName = this.userName.value;
  var fullName = this.fullName.value;
  var Password = this.Password.value;
  var flag = true;

  // validating email
  flag = this.handleEmail(email,flag);

  // validating userName
  flag = this.handleuserName(userName,flag);

  // validating fullName
  flag = this.handlefullName(fullName,flag);

  // validating Password
  flag = this.handlePassword(Password,flag);

  if(flag){
    // allow to pass through the API
    this.checkForExistingEmail("email",email,userName);
  }
  else{
    // show error (do nothing)
    console.log("invalid entry");
  }
}

render() {
    return (
      <div className = "BackgroundSign">
      <h1 className = "appName" >Annotation Tool</h1>
      <div className="logIn">
        <form>
        <p class = "signInHead">Streamlining Manual Annotations</p>
        <p class = "signUpHead">Sign Up for some usage for the customer.</p>

        <FormGroup controlId="email" bsSize="large">
          <FormControl
            autoFocus
            placeholder="Email"
            ref = {c => this.emailId = c}
          />
        </FormGroup>
        <p className = "errorMessage" ref = {c => this.emailError = c}></p>

        <FormGroup controlId="userName" bsSize="large">
          <FormControl
            autoFocus
            placeholder="userName"
            ref = {c => this.userName = c}
          />
        </FormGroup>
        <p className = "errorMessage" ref = {c => this.userNameError = c}></p>

        <FormGroup controlId="Name" bsSize="large">
          <FormControl
            autoFocus
            placeholder="Full Name"
            ref = {c => this.fullName = c}
          />
        </FormGroup>
        <p className = "errorMessage" ref = {c => this.fullNameError = c}></p>

        <FormGroup controlId="Password" bsSize="large">
          <FormControl
              placeholder="Password"
              ref = {c => this.Password = c}
              type="Password"
          />
          <p className = "errorMessage" ref = {c => this.PasswordError = c}></p>

        </FormGroup>
          <Button block bsSize="large" onClick={this.handleSubmit} type="button">
            Sign up
          </Button>
          <p class = "Terms">By signing up, you agree to our Terms , Data Policy and Cookies Policy .</p>
        </form>
      </div>

      <div className="signUpSecondBox">
        <p className = "linkToAccount">  Have an account?&nbsp;
          <Link className="linkToSignIn" to = './signin'>Log in</Link>
        </p>
      </div>
    </div>
    );
  }
}

export default SignUp;

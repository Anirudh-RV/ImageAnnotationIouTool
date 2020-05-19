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

class signUp extends Component {
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
    var username = this.userName.value;
    var fullname = this.fullName.value;
    var password = this.Password.value;
    var data = email+","+username+","+fullname+","+password
    axios.post(this.goapiurl+"/addusertodatabase",data)
      .then(res => { // then print response status
        const cookies = new Cookies()
        cookies.set('username',this.userName.value, { path: '/' })
        // redirect to CustomRouting with data
        this.props.history.push({
          pathname: '/customrouting',
          state: {usercredentials: username,checkval : res.data["message"]}
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

checkforexistingUsername = (field,value) =>{
  var data = field+","+value;
  axios.post(this.goapiurl+"/validateinfo",data)
    .then(res => { // then print response status
      if(res.data["message"] == "Yes"){
        // existing emailID
        this.userNameError.innerHTML = "UserName already taken, please try another.";
      }
      else{
        // EmailID,UserName,FullName,Password : good
        // call signUpUser
        this.signUpUser();
      }
    })
    .catch(err => { // then print response status
    console.log(err)
    })
}

checkforexistingEmail = (field,value,username) =>{
  var data = field+","+value;
  axios.post(this.goapiurl+"/validateinfo",data)
    .then(res => { // then print response status
      if(res.data["message"] == "Yes"){
        // existing emailID
        this.emailError.innerHTML = "Already existing email, do you want to login?";
      }
      else{
        // EmailID is good, check for UserName
        this.checkforexistingUsername("username",username);
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

handleuserName = (username,flag) => {
  if(this.len(username)>=4){
  this.userNameError.innerHTML = "";
  }
  else{
    flag = false;
    this.userNameError.innerHTML = "Invalid Username";
  }
  return flag;
}

handlefullName = (fullname,flag) => {
  if(this.len(fullname)!=0){
  this.fullNameError.innerHTML = "";
  }
  else{
    flag = false;
    this.fullNameError.innerHTML = "Please fill your name";
  }
  return flag;
}

handlePassword = (password,flag) => {
  if(this.len(password)>=6){
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
  var username = this.userName.value;
  var fullname = this.fullName.value;
  var password = this.Password.value;
  var flag = true;

  // validating email
  flag = this.handleEmail(email,flag);

  // validating username
  flag = this.handleuserName(username,flag);

  // validating fullName
  flag = this.handlefullName(fullname,flag);

  // validating passWord
  flag = this.handlePassword(password,flag);

  if(flag){
    // allow to pass through the API
    this.checkforexistingEmail("email",email,username);
  }
  else{
    // show error (do nothing)
    console.log("invalid entry");
  }

}
render() {
    return (
      <div className = "BackgroundSign">
      <h1 className = "AppName" >Annotation Tool</h1>
      <div className="Login">
        <form>
        <p class = "SignInHead">Streamlining Manual Annotations</p>
        <p class = "signUpHead">Sign Up for some usage for the customer.</p>

        <FormGroup controlId="email" bsSize="large">
          <FormControl
            autoFocus
            placeholder="Email"
            ref = {c => this.emailId = c}
          />
        </FormGroup>
        <p className = "ErrorMessage" ref = {c => this.emailError = c}></p>

        <FormGroup controlId="Username" bsSize="large">
          <FormControl
            autoFocus
            placeholder="Username"
            ref = {c => this.userName = c}
          />
        </FormGroup>
        <p className = "ErrorMessage" ref = {c => this.userNameError = c}></p>

        <FormGroup controlId="Name" bsSize="large">
          <FormControl
            autoFocus
            placeholder="Full Name"
            ref = {c => this.fullName = c}
          />
        </FormGroup>
        <p className = "ErrorMessage" ref = {c => this.fullNameError = c}></p>


        <FormGroup controlId="password" bsSize="large">
          <FormControl
              placeholder="Password"
              ref = {c => this.Password = c}
              type="password"
          />
          <p className = "ErrorMessage" ref = {c => this.PasswordError = c}></p>

        </FormGroup>
          <Button block bsSize="large" onClick={this.handleSubmit} type="button">
            Sign up
          </Button>
          <p class = "Terms">By signing up, you agree to our Terms , Data Policy and Cookies Policy .</p>
        </form>
      </div>

      <div className="SecondBox">
        <p className = "LinkToAccount">  Have an account?&nbsp;
          <Link className="LinkToSignIn" to = './signin'>Log in</Link>
        </p>
      </div>
    </div>
    );
  }
}

export default signUp;

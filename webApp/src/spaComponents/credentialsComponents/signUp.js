import React, { Component } from 'react';
import '../../cssComponents/App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";
import {FormGroup, FormControl} from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import IntroBar from './introBar'

class SignUp extends Component {
//TODO : ADD Footer information

componentDidMount(){
  // OnLoad function
  this.accountexists = false;
  this.userNameExists = false;
  this.handleEmail.bind(this);

  var data = require('../../jsonData/urlData.json'); //(with path)
  this.nodeServerUrl = data.nodeServerUrl
  this.goApiUrl = data.goApiUrl
  this.pythonBackEndUrl = data.mlBackEndUrl
}

//addusertodatabase
signUpUser = () =>{
    var email = this.emailId.value;
    var userName = this.userName.value;
    var fullName = this.fullName.value;
    var password = this.password.value;
    //var data = email+","+userName+","+fullName+","+password
    axios.post(this.goApiUrl+"/addusertodatabase",{
      'email':email,
      'username':userName,
      'fullname':fullName,
      'password':password}
    )
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
  //var data = field+","+value;
  var data = {'field':field,'value':value}
  axios.post(this.goApiUrl+"/validateinfo",{
    'field':field,
    'value':value
  })
    .then(res => { // then print response status
      if(res.data["message"] == "Yes"){
        // existing emailID
        this.userNameError.innerHTML = "userName already taken, please try another.";
      }
      else{
        // EmailID,userName,fullName,password : good
        // call signUpUser
        this.signUpUser();
      }
    })
    .catch(err => { // then print response status
    console.log(err)
    })
}

checkForExistingEmail = (field,value,userName) =>{
  var data = {'field':field,'value':value}
  axios.post(this.goApiUrl+"/validateinfo",{
    'field':field,
    'value':value
  })
    .then(res => { // then print response status
      if(res.data["message"] == "Yes"){
        // existing emailID
        this.emailError.innerHTML = "Already existing email, do you want to login?";
      }
      else{
        // EmailID is good, check for userName
        this.checkForExistingUserName("username",userName);
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

handlepassword = (password,flag) => {
  if(this.len(password)>=6){
  this.passwordError.innerHTML = "";
  }
  else{
    flag = false;
    console.log("Error");
    this.passwordError.innerHTML = "password too weak";
  }
  return flag;
}

handleSubmit = () =>{
  var email = this.emailId.value;
  var userName = this.userName.value;
  var fullName = this.fullName.value;
  var password = this.password.value;
  var flag = true;

  // validating email
  flag = this.handleEmail(email,flag);

  // validating userName
  flag = this.handleuserName(userName,flag);

  // validating fullName
  flag = this.handlefullName(fullName,flag);

  // validating password
  flag = this.handlepassword(password,flag);

  if(flag){
    // allow to pass through the API
    this.checkForExistingEmail("email",email,userName);
  }
  else{
    // show error (do nothing)
    console.log("Error");
  }
}

render() {
    return (
      <div className = "BackgroundSign">
      <div className="App">
      <IntroBar/>
      <h1 className = "appName" >Annotation Tool</h1>
      <div className="logIn">
        <form>
        <p class = "signInHead">Streamlining Manual Annotations</p>
        <p class = "signUpHead">SignUp For Data Annotationn Solutions.</p>

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

        <FormGroup controlId="password" bsSize="large">
          <FormControl
              placeholder="password"
              ref = {c => this.password = c}
              type="password"
          />
          <p className = "errorMessage" ref = {c => this.passwordError = c}></p>

        </FormGroup>
          <Button block bsSize="large" onClick={this.handleSubmit} type="button">
            Sign up
          </Button>
          <p class = "Terms">By signing up, you agree to our Terms , Data Policy and Cookies Policy .</p>
        </form>
      </div>

      <div className="signUpSecondBox">
        <p className = "linkToAccount">  Have an account?&nbsp;
          <Link className="linkToSignUp" to = './signin'>Log in</Link>
        </p>
      </div>
    </div>
    </div>
    );
  }
}

export default SignUp;

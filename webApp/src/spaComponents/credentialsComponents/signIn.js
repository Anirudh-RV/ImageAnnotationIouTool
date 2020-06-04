import React, { Component } from 'react'
import '../../cssComponents/App.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap"
import {FormGroup, FormControl} from "react-bootstrap"
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import IntroBar from './introBar'

class SignIn extends Component {
//TODO : ADD Footer information

componentDidMount(){
// OnLoad function
  var data = require('../../jsonData/urlData.json'); //(with path)
  this.nodeServerUrl = data.nodeServerUrl
  this.goApiUrl = data.goApiUrl
  this.pythonBackEndUrl = data.mlBackEndUrl
}

handleSubmit = () =>{
  axios.post(this.goApiUrl+"/authorizeuser",{
    'field':this.userCredentials.value,
    'value':this.Password.value
  })
    .then(res => { // then print response status
      if(res.data["message"] == "No"){
        this.Error.innerHTML = "UserName or Password incorrect."
      }else{
        const cookies = new Cookies()
        cookies.set('userName',this.userCredentials.value, { path: '/' })
        this.props.history.push({
          pathname: '/customRouting',
          state: {userCredentials: this.userCredentials.value, checkval : res.data["message"]}
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
      <div>
      <div className="App">
      <IntroBar/>
      <h1 className = "appName" >Annotation Tool</h1>
      <div className="signIn">
        <form onSubmit={this.handleSubmit}>
        <p class = "signInHead">Streamlining Manual Annotations</p>
        <p class = "signUpHead">SignIn For Data Annotationn Solutions.</p>

          <FormGroup controlId="email" bsSize="large">
            <FormControl
              autoFocus
              placeholder="Username, or email"
              ref = {c => this.userCredentials = c}
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
          <p className = "errorMessage" ref = {c => this.Error = c}></p>
        </form>
      </div>
      <div className="signInSecondBox">
        <p className = "linkToAccount"> Don't have an account?&nbsp;
          <Link className="linkToSignUp" to = './signup'>Sign up</Link>
        </p>
      </div>
      </div>
      </div>
    )
  }
}
export default SignIn

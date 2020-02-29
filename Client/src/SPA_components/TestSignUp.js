import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";
import {FormGroup, FormControl} from "react-bootstrap";


class SignUp extends Component {
//TODO : ADD Footer information

componentDidMount(){
// OnLoad function

console.log("load complete")
}

handleSubmit = () =>{

}

  render() {
    return (
      <body>
      <div className="BackgroundSign">
      <p> testing </p>
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
        <p class = "SignUpHead">Signup to make data collection and image annotation easier.</p>

        <FormGroup controlId="email" bsSize="large">
          <FormControl
            autoFocus
            placeholder="Email"
            ref = {c => this.UserName = c}
          />
        </FormGroup>

        <FormGroup controlId="FirstName" bsSize="large">
          <FormControl
            autoFocus
            placeholder="First Name"
            ref = {c => this.UserName = c}
          />
        </FormGroup>

          <FormGroup controlId="SecondName" bsSize="large">
            <FormControl
              autoFocus
              placeholder="Second Name"
              ref = {c => this.UserName = c}
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
            Sign up
          </Button>

          <p class = "Terms">By signing up, you agree to our Terms , Data Policy and Cookies Policy .</p>
        </form>
      </div>

      <div className="SecondBox">

        <p className = "LinkToAccount">  Have an account?&nbsp;
        </p>
      </div>

      <pre>

      </pre>
      </div>
      </body>
    );
  }
}
export default SignUp;

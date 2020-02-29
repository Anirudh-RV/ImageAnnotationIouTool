import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";
import {FormGroup, FormControl} from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';

class Signin extends Component {
//TODO : ADD Footer information

  render() {
    return (
      <div className = "BackgroundSign">
      <h1 className = "AppName" >404. That’s an error.</h1>
      <div className="SignIn">
        <p className="SignInHead">Sorry, this page isn't available.</p>
        <p className = "LinkToAccount"> The link you followed may be broken, or the page may have been removed.<br/>
          <Link className="LinkToImageAnnotation" to = '/'>Go back to XP-1.</Link>
        </p>
      </div>
      </div>
    );
  }
}
export default Signin;

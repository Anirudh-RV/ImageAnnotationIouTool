import React, { Component } from 'react';
import '../cssComponents/App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";
import {FormGroup, FormControl} from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';

class Error extends Component {
//TODO : ADD Footer information

  render() {
    return (
      <div>
      <h1 className = "appName" >404. That’s an error.</h1>
      <div className="signIn">
        <p className="signInHead">Sorry, this page isn't available.</p>
        <p className = "linkToAccount"> The link you followed may be broken, or the page may have been removed.<br/>
          <Link className="linkToImageAnnotation" to = '/'>Go back to Homepage.</Link>
        </p>
      </div>
      </div>
    );
  }
}
export default Error;

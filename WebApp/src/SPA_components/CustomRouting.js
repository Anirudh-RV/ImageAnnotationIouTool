import React, { Component } from 'react';
import './App.css';
import styles from './mystyle.module.css'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import UploadMultipleFiles from './UploadMultipleFiles';
import EditPage from './EditPage';
import Home from './Home';
import DownloadVideoComponent from './DownloadVideoComponent';
import WelcomePage from './WelcomePage';
import Error from './Error';

import { useLocation } from 'react-router-dom'

class CustomRouting extends Component {
//TODO : ADD Footer information

  render() {
    // if logged in, redirect back to edit page or go to home
    try{
    if(this.props.location.state.checkval=== "Yes"){
      console.log("path: "+this.props.location.pathname);
      return (
         <BrowserRouter>
          <div>
            <Switch />
              <Switch>
              <Route path="/upload" component={UploadMultipleFiles}/>
              <Route path="/EditPage" component={EditPage}/>
              <Route path="/DownloadVideoComponent" component={DownloadVideoComponent}/>
              <Route path="/WelcomePage" component={WelcomePage}/>
              <Redirect to={{
            pathname: '/WelcomePage',
            state: {userName:this.props.location.state.usercredentials}
        }}
/>
             </Switch>
          </div>
        </BrowserRouter>
      );
    }
    else{
      console.log("failure")
      return (
         <div>
              <Redirect to="/" />
              <Route component={Error} />
         </div>
      );
    }
  }
  catch(e){
    console.log("catch")
      return (
         <div>
              <Redirect to="/" />
              <Route component={Error} />
         </div>
      );
    }
  }
}
export default CustomRouting;

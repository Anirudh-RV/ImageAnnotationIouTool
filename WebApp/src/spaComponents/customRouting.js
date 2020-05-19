import React, { Component } from 'react';
import '../cssComponents/App.css';
import styles from '../cssComponents/myStyle.module.css'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import uploadMultipleFiles from './uploadMultipleFiles';
import editPage from './editPage';
import Home from './Home';
import downloadVideoComponent from './downloadVideoComponent';
import welcomePage from './welcomePage';
import Error from './Error';

import { useLocation } from 'react-router-dom'

class customRouting extends Component {
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
              <Route path="/upload" component={uploadMultipleFiles}/>
              <Route path="/editPage" component={editPage}/>
              <Route path="/downloadVideoComponent" component={downloadVideoComponent}/>
              <Route path="/welcomePage" component={welcomePage}/>
              <Redirect to={{
            pathname: '/welcomePage',
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
export default customRouting;

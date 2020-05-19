import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import UploadMultipleFiles from './uploadMultipleFiles';
import EditPage from './editPage';
import Home from './Home';
import DownloadVideoComponent from './downloadVideoComponent';
import WelcomePage from './welcomePage';
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
              <Route path="/editpage" component={EditPage}/>
              <Route path="/downloadvideocomponent" component={DownloadVideoComponent}/>
              <Route path="/welcomepage" component={WelcomePage}/>
              <Redirect to={{
            pathname: '/welcomepage',
            state: {userName:this.props.location.state.userCredentials}
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

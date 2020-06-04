import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import UploadMultipleFiles from '../imageComponents/uploadMultipleFiles'
import EditPage from '../imageComponents/editPage'
import DownloadVideoComponent from '../videoComponents/downloadVideoComponent'
import WelcomePage from '../credentialsComponents/welcomePage'
import Error from '../credentialsComponents/Error'

import { useLocation } from 'react-router-dom'

class CustomRouting extends Component {
//TODO : ADD Footer information

  render() {
    // if logged in, redirect back to edit page or go to signIN
    try{
    if(this.props.location.state.checkval=== "Yes"){
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
      )
    }
    else{
      console.log("failure")
      return (
         <div>
              <Redirect to="/" />
              <Route component={Error} />
         </div>
      )
    }
  }
  catch(e){
      return (
         <div>
              <Redirect to="/" />
              <Route component={Error} />
         </div>
      )
    }
  }
}
export default CustomRouting

import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import UploadMultipleFiles from './uploadMultipleFiles';
import SignIn from './signIn';
import SignUp from './signUp';
import CustomRouting from './customRouting';
import Error from './Error';

// Routes for the webpages in the project

class Routes extends Component {
  render() {
    const cookies = new Cookies()
    if(cookies.get('userName')){
      console.log(cookies.get('userName'))
      return (
        <BrowserRouter>
         <div>
           <Switch />
             <Switch>
             <Route path="/customrouting" component = {CustomRouting} />
             <Redirect to={{
                       pathname: '/customrouting',
                       state: {userCredentials: cookies.get('userName'),checkval : "Yes"}
                       }}
             />
            </Switch>
         </div>
       </BrowserRouter>
      );
    }
    else{
      return (
           <BrowserRouter>
            <div>
              <Switch />
                <Switch>
                 <Route exact path="/" component={Home} />
                 <Route path="/customrouting" component = {CustomRouting} />
                 <Route path="/signup" component = {SignUp} />
                 <Route path="/signin" component= {SignIn} />
                 <Route exact path = "/index.html" component = {Home} />
                 <Route component={Error} />
               </Switch>
            </div>
          </BrowserRouter>
        );
      }
  }
}
export default Routes;

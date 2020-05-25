import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SignIn from '../credentialsComponents/signIn';
import SignUp from '../credentialsComponents/signUp';
import CustomRouting from '../routingComponents/customRouting';
import Error from '../credentialsComponents/Error';

// Routes for the webpages in the project

class Routes extends Component {
  render() {
    const cookies = new Cookies()
    if(cookies.get('userName')){
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
                 <Route exact path="/" component={SignIn} />
                 <Route path="/customrouting" component = {CustomRouting} />
                 <Route path="/signup" component = {SignUp} />
                 <Route path="/signin" component= {SignIn} />
                 <Route path="/welcomepage" component = {SignIn} />
                 <Route path="/upload" component = {SignIn} />
                 <Route component={Error} />
               </Switch>
            </div>
          </BrowserRouter>
        );
      }
  }
}
export default Routes;

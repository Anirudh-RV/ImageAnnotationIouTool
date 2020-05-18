import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import UploadMultipleFiles from './UploadMultipleFiles';
import Signin from './Signin';
import SignUp from './SignUp';
import CustomRouting from './CustomRouting';
import Error from './Error';

// Routes for the webpages in the project

class Routes extends Component {
  render() {
    const cookies = new Cookies()
    if(cookies.get('username')){
      console.log(cookies.get('username'))
      return (
        <BrowserRouter>
         <div>
           <Switch />
             <Switch>
             <Route path="/customrouting" component = {CustomRouting} />
             <Redirect to={{
                       pathname: '/customrouting',
                       state: {usercredentials: cookies.get('username'),checkval : "Yes"}
                       }}
             />
            </Switch>
         </div>
       </BrowserRouter>
      );
    }else{
      return (
           <BrowserRouter>
            <div>
              <Switch />
                <Switch>
                 <Route exact path="/" component={Home} />
                 <Route path="/customrouting" component = {CustomRouting} />
                 <Route path="/signup" component = {SignUp} />
                 <Route path="/signin" component= {Signin} />
                 <Route exact path = "/index.html" component = {Home} />
                 <Route path = "/error" component = {Error} />
                 <Route exact path = "/error.html" component = {Error} />
                 <Route component={Error} />
               </Switch>
            </div>
          </BrowserRouter>
        );
      }
  }
}
export default Routes;

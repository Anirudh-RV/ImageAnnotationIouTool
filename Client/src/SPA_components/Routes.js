import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UploadFile from './UploadFile';
import Home from './Home';
import UploadMultipleFiles from './UploadMultipleFiles';
import TestAPI from './TestAPI';
import Signin from './Signin';
import TestDraw from './test_draw';
import SignUp from './SignUp';
import TestSignUp from './TestSignUp';
import CustomRouting from './CustomRouting';
import Error from './Error';
import TestCookie from './Test_Cookies';
import TestDjangoApi from './TestDjangoApi';
import TestNodeAPI from './TestNodeAPI';

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
                 <Route path="/testapi" component={TestAPI} />
                 <Route path ="/upload" component = {CustomRouting} />
                 <Route path = "/testnodeapi" component = {TestNodeAPI} />
                 <Route path = "/testdjangoapi" component = {TestDjangoApi} />
                 <Route component={Error} />
               </Switch>
            </div>
          </BrowserRouter>
        );
      }
  }
}

export default Routes;

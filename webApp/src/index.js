import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './spaComponents/Routes';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';



 ReactDOM.render((
 <BrowserRouter>
   <Routes />
 </BrowserRouter>

 ), document.getElementById('root'));

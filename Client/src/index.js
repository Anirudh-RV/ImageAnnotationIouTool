import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './SPA_components/Routes';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';



 ReactDOM.render((
 <BrowserRouter>
   <Routes />
 </BrowserRouter>

 ), document.getElementById('root'));

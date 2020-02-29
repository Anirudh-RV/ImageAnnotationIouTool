import React,{ useState}  from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import './App.css';
import styles from './mystyle.module.css'
import navstyle from './navbarcss.css'
import ReactDOM, {render} from 'react-dom';
import PropTypes from 'prop-types';
import {Navbar, Nav, NavItem, NavDropdown,Form,FormControl,Button} from 'react-bootstrap';
import { DropdownMenu ,MenuItem} from 'react-bootstrap-dropdown-menu';
import { Collapse, CardBody, Card } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/*
onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
*/

const Navigationclass = () => (
   <nav>
     <ul className={styles.NaviText}>
       <li><NavLink exact activeClassName="current" to='/'>Home</NavLink></li>
       <li><NavLink exact activeClassName="current" to='/about'>About</NavLink></li>
       <li><NavLink exact activeClassName="current" to='/contact'>Contact</NavLink></li>
     </ul>
   </nav>
 );

 const NavigationBarComp = () => {
   // 1st element.
   const [isOpen1, setIsOpen1] = useState(false);
   const toggle1open = () => {
     if(isOpen1 == true)
     {
       // opened already, no need to open again.
       // to close, because it is already open.
       setIsOpen1(false);
     }
     else {
       // isOpen1 is false.
       // need to open now.
       setIsOpen1(true);
     }
   }
   const toggle1close = () => {
     if(isOpen1 == true)
     {
       // opened already, no need to open again.
       // need to close.
       setIsOpen1(false);
     }
     else { // isOpen1 is false.
       // closed already.
     }
   }
   const [collapse1, setCollapse1] = useState(false);

   // 2nd element.
   const [isOpen2, setIsOpen2] = useState(false);
   const toggle2open = () => {
     if(isOpen2 == true)
     {
       // opened already, no need to open again.
       // to close, because it is already open.
       setIsOpen2(false);
     }
     else {
       // isOpen2 is false.
       // need to open now.
       setIsOpen2(true);
     }
   }
   const toggle2close = () => {
     if(isOpen2 == true)
     {
       // opened already, no need to open again.
       // need to close.
       setIsOpen2(false);
     }
     else { // isOpen2 is false.
       // closed already.
     }
   }
   const [collapse2, setCollapse2] = useState(false);

   // 3rd element.
   const [isOpen3, setIsOpen3] = useState(false);
   const toggle3open = () => {
    if(isOpen3 == true)
      {
        // opened already, no need to open again.
        // to close, because it is already open.
        setIsOpen3(false);
      }
      else {
        // isOpen3 is false.
        // need to open now.
        setIsOpen3(true);
      }
    }
    const toggle3close = () => {
    if(isOpen3 == true)
    {
      // opened already, no need to open again.
      // need to close.
      setIsOpen3(false);
    }
    else { // isOpen3 is false.
      // closed already.
    }
}
    const [collapse3, setCollapse3] = useState(false);

    // 4th element.
    const [isOpen4, setIsOpen4] = useState(false);
    const toggle4open = () => {
      if(isOpen4 == true)
      {
        // opened already, no need to open again.
        // to close, because it is already open.
        setIsOpen4(false);
      }
      else {
        // isOpen4 is false.
        // need to open now.
        setIsOpen4(true);
      }
    }
    const toggle4close = () => {
      if(isOpen4 == true)
      {
        // opened already, no need to open again.
        // need to close.
        setIsOpen4(false);
      }
      else { // isOpen4 is false.
        // closed already.
      }
    }
   const [collapse4, setCollapse4] = useState(false);

   return (
     <nav>
       <ul className={styles.NaviText}>
       <li className={styles.Navielements} onClick={toggle1open} onMouseLeave = {toggle1close}>
       <button id="btnFile" className={styles.btnclass}>FILE</button>
       <Collapse className={styles.collapse} isOpen={isOpen1}>
       <ul className={styles.DropdownNavi}>
         <li><NavLink exact activeClassName="current" to='/'>Home1</NavLink></li>
         <li><NavLink exact activeClassName="current" to='/about'>About1</NavLink></li>
         <li><NavLink exact activeClassName="current" to='/contact'>Contact1</NavLink></li>
      </ul>
       </Collapse>
       </li>

       <li className={styles.Navielements} onClick={toggle2open} onMouseLeave = {toggle2close}>
       <button className={styles.btnclass}>EDIT</button>
       <Collapse className={styles.collapse} isOpen={isOpen2}>
       <ul className={styles.DropdownNavi}>
         <li><NavLink exact activeClassName="current" to='/'>Home2</NavLink></li>
         <li><NavLink exact activeClassName="current" to='/about'>About2</NavLink></li>
         <li><NavLink exact activeClassName="current" to='/contact'>Contact2</NavLink></li>
      </ul>
       </Collapse>
       </li>

       <li className={styles.Navielements} onClick={toggle3open} onMouseLeave = {toggle3close}>
       <button className={styles.btnclass}>VIEW</button>
       <Collapse className={styles.collapse} isOpen={isOpen3}>
       <ul className={styles.DropdownNavi}>
         <li><NavLink exact activeClassName="current" to='/'>Home3</NavLink></li>
         <li><NavLink exact activeClassName="current" to='/about'>About3</NavLink></li>
         <li><NavLink exact activeClassName="current" to='/contact'>Contact3</NavLink></li>
      </ul>
       </Collapse>
       </li>

       <li className={styles.Navielements} onClick={toggle4open} onMouseLeave = {toggle4close}>
       <button className={styles.btnclass}>HELP</button>
       <Collapse className={styles.collapse} isOpen={isOpen4}>
       <ul className={styles.DropdownNavi}>
          <li><NavLink exact activeClassName="current" to='/'>Home4</NavLink></li>
          <li><NavLink exact activeClassName="current" to='/about'>About4</NavLink></li>
          <li><NavLink exact activeClassName="current" to='/contact'>Contact4</NavLink></li>
       </ul>
       </Collapse>
       </li>
      </ul>
    </nav>
   );
 }

const NavigationBar = () => (
  <div>
    <NavigationBarComp />
  </div>
);

export default NavigationBar;

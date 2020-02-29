import React, { Component } from 'react';
import './App.css';
import styles from './mystyle.module.css'
import NavigationBar from './NavigationBar'
import WorkingArea from './WorkingArea'
import Footer from './Footer'

class EditPage extends Component {
//TODO : ADD Footer information

  render() {
    return (
      <div>
      <p className="Username" ref = {c => this.UserTag = c}>{this.props.location.state.userName}</p>
      <body>
         <NavigationBar/>
         <WorkingArea name={this.props.location.state.userName}/>
      </body>
     </div>
    );
  }
}
export default EditPage;

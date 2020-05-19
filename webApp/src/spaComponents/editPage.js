import React, { Component } from 'react';
import '../cssComponents/App.css';
import styles from '../cssComponents/myStyle.module.css';
import NavigationBar from './navigationBar';
import WorkingArea from './workingArea';

class EditPage extends Component {
//TODO : ADD Footer information

  render() {
    return (
      <div>
      <p className="userName" ref = {c => this.UserTag = c}>{this.props.location.state.userName}</p>
      <body>
         <NavigationBar/>
         <WorkingArea name={this.props.location.state.userName}/>
      </body>
     </div>
    );
  }
}
export default EditPage;

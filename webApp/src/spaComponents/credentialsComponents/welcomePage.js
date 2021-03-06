import React, { Component } from 'react'
import {Progress} from 'reactstrap'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'
import '../../cssComponents/App.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap"
import {FormGroup, FormControl} from "react-bootstrap"
import { Link } from 'react-router-dom'

class WelcomePage extends Component {

componentDidMount(){
// OnLoad function
this.heading.innerHTML = this.props.location.state.userName+"</br>Annotation Tool"
}

redirecToEditPage = () =>{
  var userName = this.props.location.state.userName
  this.props.history.push({
    pathname: '/editPage',
    state: {userName: this.props.location.state.userName}
  })
}

UploadVideo = () =>{
  var userName = this.props.location.state.userName
  this.props.history.push({
    pathname: '/DownloadVideoComponent',
    state: {userName: this.props.location.state.userName}
})
}

StartAnnotation = () =>{
  var userName = this.props.location.state.userName
  this.props.history.push({
    pathname: '/upload',
    state: {userName: this.props.location.state.userName}
})
}

logOut = () =>{
    const cookies = new Cookies()
    cookies.remove('userName')
    window.location.reload(false)
}


render() {
    return (
      <div>
      <h1 className = "appName" ref = {c => this.heading = c}></h1>
      <div className="signIn">
        <form>
        <p class = "signInHead">Annotation Tool</p>
        &nbsp;
          <Button className="StartButton" block bsSize="large" onClick={this.StartAnnotation} type="button">
            Upload Images
          </Button>

          <Button className="StartButton" block bsSize="large" onClick={this.UploadVideo} type="button">
            Upload Videos
          </Button>

          <Button className="StartButton" block bsSize="large" onClick={this.redirecToEditPage} type="button">
            View Images
          </Button>

          <br/>
          <p className = "errorMessage" ref = {c => this.Message = c}></p>
        </form>
      </div>
      <div className="signIn" ref = {c => this.Info = c}>
        <p className = "linkToAccount"> Click here when done &nbsp;
          <Link className="linkToSignUp" onClick={this.logOut}>Logout</Link>
        </p>
      </div>
      </div>
    )
  }
}

export default WelcomePage

import React, { Component } from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";
import {FormGroup, FormControl} from "react-bootstrap";
import { Link } from 'react-router-dom';

class DownloadVideoComponent extends Component {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        loaded:0
      }
      this.nodeserverurl = "http://localhost:4000"
      this.goapiurl = "http://localhost:8080"
      this.pythonbackendurl = "http://localhost:8000"
}

componentDidMount(){
this.heading.innerHTML = this.props.location.state.userName+"</br>Annotate Data Directly From Videos";
}

dividetheframes = (type,name,current,total) =>{
  console.log("Type: "+type+", Name: "+name+", current: "+current+", total: "+total)
  var username = this.props.location.state.userName
  var imagetype = 'jpeg'
  var low = '1'
  var high = '5'

  if(type == "VideoUpload"){
    var videoname =  name
    var videourl = this.nodeserverurl+'/img/'+username+'/videos/'+videoname
  }
  else if(type == "YouTube")
  {
    var videoname =  this.videoname.value
    var videourl = this.nodeserverurl+'/videos/'+username+'/downloads/'+videoname+'.mp4'
  }
  var data = {'username':username,'videoname':videoname,'videourl':videourl,'imagetype':imagetype,'low':low,'high':high}

  axios.post(this.pythonbackendurl+"/dividetheframes/",data)
    .then(res => { // then print response status
      //toast.success('upload success')
      console.log("API message : ")
      console.log(res)

    if(type == "YouTube"){
        this.gotoeditpage();
      }
    else{
      if(current == total-1){
        this.gotoeditpage();
      }
    }
    })
    .catch(err => { // then print response status
    console.log("fail")
    console.log(err)
  })
}

checkMimeType=(event)=>{
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    const types = ['image/png', 'image/jpeg', 'image/gif','video/mp4']
    // loop access array
    for(var x = 0; x<files.length; x++) {
     // compare file type find doesn't matach
         if (types.every(type => files[x].type !== type)) {
         // create error message and assign to container
         err[x] = files[x].type+' is not a supported format\n';
       }
     };
     for(var z = 0; z<err.length; z++) {// if message not same old that mean has error
         // discard selected file
        event.target.value = null
    }
   return true;
}

maxSelectFile=(event)=>{
    let files = event.target.files
        if (files.length > 101) {
           const msg = 'Only 10 images can be uploaded at a time'
           event.target.value = null
           return false;
      }
    return true;
}

checkFileSize=(event)=>{
  let files = event.target.files
  let size = 2000000
  let err = [];
  for(var x = 0; x<files.length; x++) {
  if (files[x].size > size) {
   err[x] = files[x].type+'is too large, please pick a smaller file\n';
    }
  };
  for(var z = 0; z<err.length; z++) {// if message not same old that mean has error
    // discard selected file
   event.target.value = null
  }
  return true;
}

onChangeHandler=event=>{
  var files = event.target.files
  if(this.maxSelectFile(event) && this.checkMimeType(event)){
  // if return true allow to setState
     this.setState({
     selectedFile: files,
     loaded:0
   })
  }
}

onClickHandler = () => {
    const data = new FormData()

    // getting username from input
    var userName = this.props.location.state.userName;
    var videoNames = []
    // filling FormData with selectedFiles(Array of objects)
    for(var x = 0; x<this.state.selectedFile.length; x++) {
      console.log('1-Video being uploaded: '+this.state.selectedFile[x].name)
      videoNames.push(this.state.selectedFile[x].name)
      data.append('file', this.state.selectedFile[x])
    }

    // header carries information of username to backend with data
    axios.post(this.nodeserverurl+"/upload",data,
    {
    headers: {
      userName: userName,
      type: 'VideoUpload'
    },
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      },
    })
    .then(res => { // then print response status
      for(var x = 0; x< videoNames.length; x++ ){
        console.log('file name: '+videoNames[x])
        this.dividetheframes("VideoUpload",videoNames[x],x,videoNames.length)
      }
        // redirect to WorkingArea.js for viewing images
    })
    .catch(err => { // then print response status
    console.log(err)
  })
}


wait = (ms) =>{
  var d = new Date();
  var d2 = null;
  do { d2 = new Date(); }
  while(d2-d < ms);
}

gotoeditpage = () =>{
  var userName = this.props.location.state.userName;
  this.props.history.push({
    pathname: '/EditPage',
    state: {userName: this.props.location.state.userName}
  })
}

handleSubmit = () =>{
  this.Message.innerHTML = "The process may take a few minutes..."
  axios.post(this.nodeserverurl+"/download/",{
    username : this.props.location.state.userName,
    videoname : this.videoname.value,
    videourl : this.videourl.value,
  })
  .then(res => { // then print response status
    //toast.success('upload success')
    console.log(res)
    this.Message.innerHTML = "Download complete..."
  })
  .catch(err => {
  console.log("fail")
  console.log(err)
  })
}

render() {
    return (
      <div className = "BackgroundSign">
      <h2 className = "AppName" ref = {c => this.heading = c}></h2>


      <div className="VideoUpload">
        <label>Upload Videos from your System</label>
        <input id="Video_Upload" type="file" class="form-control" multiple onChange={this.onChangeHandler}/>
        <div class="form-group">
          <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
        </div>
        <button type="button" class="buttonclass" onClick={this.onClickHandler}>Upload</button>

      </div>


      <div className="SignIn">
        <form onSubmit={this.handleSubmit}>
        <p class = "SignInHead">Annotation Tool</p>
        <p class = "SignUpHead">Upload Video From YouTube</p>
        &nbsp;
          <FormGroup controlId="url" bsSize="large">
            <FormControl
              autoFocus
              placeholder="Enter the url of the youtube video"
              ref = {c => this.videourl = c}
            />
          </FormGroup>

          <FormGroup controlId="url" bsSize="large">
            <FormControl
              autoFocus
              placeholder="Enter the name of the video"
              ref = {c => this.videoname = c}
            />
          </FormGroup>

          <Button className="StartButton" block bsSize="large" onClick={this.handleSubmit} type="button">
            Download
          </Button>

          <Button className="StartButton" block bsSize="large" onClick={this.dividetheframes} type="button">
            Start Annotation
          </Button>
          <br/>
          <p className = "ErrorMessage" ref = {c => this.Message = c}></p>
        </form>
      </div>

      <div className="SecondBoxSignIn" ref = {c => this.Info = c}>
        <p className = "LinkToAccount"> Download complete and not redirecting?Click here&nbsp;
          <Link className="LinkToSignUp" onClick={this.dividetheframes}>Redirect</Link>
        </p>
      </div>
      </div>
    );
  }
}

export default DownloadVideoComponent;

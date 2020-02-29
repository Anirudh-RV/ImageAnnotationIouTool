import React, { Component } from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Home from './Home';

class UploadMultipleFiles extends Component {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        loaded:0
      }

  }

Logout = () =>{
    const cookies = new Cookies()
    cookies.remove('username');
    window.location.reload(false);
}
  checkMimeType=(event)=>{
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    const types = ['image/png', 'image/jpeg', 'image/gif']
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

// using Api, add names of the images being uploaded to a database
  addToBackendUsingApi = (files) =>{

      var userName = this.props.location.state.userName;

      var fileNames = userName+",";
      for(var x =0; x<files.length-1;x++)
      {
        fileNames = fileNames +files[x].name+ ",";
      }
      fileNames = fileNames + files[files.length-1].name;
      // api call
      axios.post("http://localhost:8080/insertimagedata",fileNames)
        .then(res => { // then print response status
          console.log(res)
        })
        .catch(err => { // then print response status
        console.log(err)
        })
}

// &&    this.checkFileSize(event) taken out for unlimited uploads
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

RedirecToEditPage = () =>{
  var userName = this.props.location.state.userName;
  this.props.history.push({
    pathname: '/EditPage',
    state: {userName: this.props.location.state.userName}
})

}
  onClickHandler = () => {
    const data = new FormData()

    // getting username from input
    var userName = this.props.location.state.userName;

    // filling FormData with selectedFiles(Array of objects)
    for(var x = 0; x<this.state.selectedFile.length; x++) {
      data.append('file', this.state.selectedFile[x])
    }

    // header carries information of username to backend with data
    axios.post("http://localhost:4000/upload",data,
    {
    headers: {
      userName: userName
    },
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      },
    })
      .then(res => { // then print response status
        this.addToBackendUsingApi(this.state.selectedFile)
        // redirect to WorkingArea.js for viewing images
      })
      .catch(err => { // then print response status
      console.log(err)
      })

    }

render() {
    return (
    <div class="container">
	     <div class="row">
          <div class="offset-md-3 col-md-6">
              <div class="form-group files">
                <label>Upload Your File </label>
                <input id="input_upload" type="file" class="form-control" multiple onChange={this.onChangeHandler}/>
              </div>
              <div class="form-group">
                <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
              </div>
              <button type="button" class="buttonclass" onClick={this.onClickHandler}>Upload</button>
              <button type="button" class="buttonclass" onClick={this.RedirecToEditPage}>View Images</button>
              <button type="button" class="buttonclass" onClick={this.Logout}>Log out</button>
	      </div>
      </div>
    </div>
    );
  }
}

export default UploadMultipleFiles;

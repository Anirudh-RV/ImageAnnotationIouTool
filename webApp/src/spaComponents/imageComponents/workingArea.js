import React, { Component } from 'react';
import '../../cssComponents/App.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

class WorkingArea extends Component {
//TODO : ADD INTRODUCTION TO PROJECT

constructor(){
  super();
  this.state= {
    index:0,
  }
  var data = require('../../jsonData/urlData.json'); //(with path)
  this.nodeServerUrl = data.nodeServerUrl
  this.goApiUrl = data.goApiUrl
  this.pythonBackEndUrl = data.mlBackEndUrl
}

onButton = () => {
  this.flag = true;
  this.initDraw(this.divCanvas,this.flag,this.outputdiv);

}

offButton = () => {
  this.flag= false;
  this.initDraw(this.divCanvas,this.flag,this.outputdiv );
}

initDraw= (drawElement,flag,outputdiv) => {
    function setMousePosition(e) {
        var ev = e || window.event; //Moz || IE
        if (ev.pageX) { //Moz
            mouse.x = ev.pageX;
            mouse.y = ev.pageY;
        }
        else if (ev.clientX) { //IE
            mouse.x = ev.clientX ;
            mouse.y = ev.clientY ;
        }
    };
    var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    var element = null;
    drawElement.onmousemove = function (e) {
      // draw only when flad is On
      if(flag) {
        setMousePosition(e);
        if (element !== null) {
            element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
            element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
            element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
            element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
        }
      }
    }
    drawElement.onclick = function (e) {
      if(flag) {
        if (element !== null) {
            element = null;
            drawElement.style.cursor = "default";
            this.EndX = mouse.x;
            this.EndY = mouse.y - 125;
            var dataDrawn = "("+this.StartX+","+this.StartY+") ("+this.EndX+","+this.EndY+")"
            this.imageTextData = dataDrawn
            outputdiv.innerHTML = outputdiv.innerHTML +"\n"+dataDrawn
        }
        else {
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
            element = document.createElement('div');
            element.className = 'rectangle'
            element.style.left = mouse.x + 'px';
            element.style.top = mouse.y + 'px';
            drawElement.appendChild(element)
            drawElement.style.cursor = "crosshair";
            this.StartX = mouse.x;
            this.StartY = mouse.y - 125;
      }
    }
  }
}

saveAsTextFile = () =>{
  // send to nodejs to save
  axios.post(this.nodeServerUrl+"/saveastextfile/",{
    userName : this.props.name,
    imageName : this.state.imageNames[this.state.index],
    imageData : this.outputdiv.innerHTML
    })
    .then(res => {
    })
    .catch(err => { // then print response status
    console.log(err)
    })
}

NextImage= () => {
  // clearing out previously draw boxes and adding back the image tag
  this.divCanvas.innerHTML = "";
  this.divCanvas.appendChild(this.ImageTag);
  if(this.state.index>this.state.imageNames.length-2) {
    // Do nothing
  }
  else {
    this.state.index = this.state.index + 1
    if(this.ImageTag) {
     this.ImageTag.src = this.nodeServerUrl+"/img/"+this.props.name+"/images/"+this.state.imageNames[this.state.index];
      }
    }
  this.outputdiv.innerHTML = "";
}

PrevImage= () => {
  // clearing out previously draw boxes and adding back the image tag
  this.divCanvas.innerHTML = "";
  this.divCanvas.appendChild(this.ImageTag);
  if(this.state.index == 0) {
  }
  else {
  this.state.index = this.state.index - 1
  if(this.ImageTag) {
   this.ImageTag.src = this.nodeServerUrl+"/img/"+this.props.name+"/images/"+this.state.imageNames[this.state.index];
    }
  }
  this.outputdiv.innerHTML = "";
}

getYoloMlOutPut = () =>{
  var userName = this.props.name
  var imageName = this.state.imageNames[this.state.index]
  var url = this.nodeServerUrl+"/img/"+this.props.name+"/images/"+this.state.imageNames[this.state.index]
  var mlOutPutUrl = this.nodeServerUrl+"/img/"+this.props.name+"/images/yoloOutput_"+this.props.name+"_"+imageName
  var data = {'userName':userName,'imageName':imageName,'imageUrl':url,'Coordinates':this.outputdiv.innerHTML}

  axios.post(this.pythonBackEndUrl+"/yolo/",{
    'userName':userName,
    'imageName':imageName,
    'imageUrl':url,
    'Coordinates':this.outputdiv.innerHTML
  })
  .then(res => {
      window.open(mlOutPutUrl, '_blank');
    })
    .catch(err => { // then print response status
    console.log(err)
    })
}

getTextBoxPPOutPut = () =>{
  var userName = this.props.name
  var imageName = this.state.imageNames[this.state.index]
  var url = this.nodeServerUrl+"/img/"+this.props.name+"/images/"+this.state.imageNames[this.state.index]
  var mlOutPutUrl = this.nodeServerUrl+"/img/"+this.props.name+"/images/TextBoxPPOutput_"+this.props.name+"_"+imageName

  axios.post(this.pythonBackEndUrl+"/textboxpp/", {
    'userName':userName,
    'imageName':imageName,
    'imageUrl':url
  })
  .then(res => {
      window.open(mlOutPutUrl, '_blank');
    })
    .catch(err => { // then print response status
    console.log(err)
  })
}

apiFuncGetImages = (userName) => {
  // data is going to be the userName
  axios.post(this.goApiUrl+"/getimages",{
  'username':userName
  })
  .then(res => {
       var imageNames = res.data.ImageNames
       this.state.imageNames = imageNames
         if(this.ImageTag) {
          this.ImageTag.src = this.nodeServerUrl+"/img/"+this.props.name+"/images/"+this.state.imageNames[this.state.index];
       }
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

downloadComponent = (url,type) =>{
  axios({
  url: url, //your url
  method: 'GET',
  responseType: 'blob', // important
  })
  .then((response) => {
   const url = window.URL.createObjectURL(new Blob([response.data]));
   const link = document.createElement('a');
   link.href = url;
   link.setAttribute('download', this.props.name+type+'.zip'); //or any other extension
   document.body.appendChild(link);
   link.click();
  });
}

downloadFiles = () =>{
    axios.post(this.nodeServerUrl+"/downloadfiles/",{
      username : this.props.name
    })
    .then(res => {
      // after creating the zip file, now download
      this.wait(5000);
      this.downloadComponent(this.nodeServerUrl+'/img/'+this.props.name+'.zip','Annotations');
    })
    .catch(err => {
    // then print response status
    console.log(err)
  })
}

downloadAllFiles = () =>{
  axios.post(this.nodeServerUrl+"/downloadallfiles/",{
    userName : this.props.name
  })
    .then(res => { // then print response status
      // after creating the zip file, now download, delay for zip file creation
      this.wait(5000);
      this.downloadComponent(this.nodeServerUrl+'/img/all_'+this.props.name+'.zip','');
    })
    .catch(err => {
    // then print response status
    console.log(err)
  })
}

componentDidMount(){
    // Call GO API to get all the image names of userName
    this.apiFuncGetImages(this.props.name)
    // setting environment variables
    this.flag = false;
    this.startX = 0;
    this.EndX = 0;
    this.StartY = 0;
    this.EndY = 0;
    this.imageTextData = " ";
}

render() {
    return (
      <div>
        <div className = "columnLeft">
        <p ref = {c => this.pTag = c} >Left Side</p>
          <div ref = {c => this.divCanvas = c} >
          <img className='name' ref = {c => this.ImageTag = c}/>
          </div>
        </div>
        <div className = "columnRight">
        <p>Right Side</p>
        <Button className="StartButton" block bsSize="large" onClick={this.NextImage} type="button">
         NEXT
       </Button>

       <Button className="StartButton" block bsSize="large" onClick={this.PrevImage} type="button">
         PREVIOUS
       </Button>

       <Button className="StartButton" block bsSize="large" onClick={this.onButton} type="button">
         ON
       </Button>

       <Button className="StartButton" block bsSize="large" onClick={this.offButton} type="button">
         OFF
       </Button>

       <Button className="StartButton" block bsSize="large" onClick={this.saveAsTextFile} type="button">
         SAVE
       </Button>

       <Button className="StartButton" block bsSize="large" onClick={this.getTextBoxPPOutPut} type="button">
         CHECK TEXTBOX++ OUTPUT
       </Button>

       <Button className="StartButton" block bsSize="large" onClick={this.getYoloMlOutPut} type="button">
         CHECK YOLO OUTPUT
       </Button>

       <Button className="StartButton" block bsSize="large" onClick={this.downloadFiles} type="button">
         DOWNLOAD ANNOTATIONS
       </Button>

       <Button className="StartButton" block bsSize="large" onClick={this.downloadAllFiles} type="button">
         DOWNLOAD ALL-Please disable adblock for download
       </Button>

        </div>
        <p hidden ref = {c =>this.outputdiv = c}>
        </p>
      </div>
    );
  }
}

export default WorkingArea;
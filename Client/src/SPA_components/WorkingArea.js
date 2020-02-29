import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class WorkingArea extends Component {
//TODO : ADD INTRODUCTION TO PROJECT

constructor(){
  super();
  this.state= {
    index:0,
  }
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

saveastextfile = () =>{
  // send to nodejs to save
  axios.post("http://localhost:4000/saveastextfile/",{
    username : this.props.name,
    imagename : this.state.ImageNames[this.state.index],
    imagedata : this.outputdiv.innerHTML
    })
    .then(res => { // then print response status
      console.log(res)
    })
    .catch(err => { // then print response status
    console.log(err)
    })
}

NextImage= () => {
  // clearing out previously draw boxes and adding back the image tag
  this.divCanvas.innerHTML = "";
  this.divCanvas.appendChild(this.ImageTag);
  if(this.state.index>this.state.ImageNames.length-2) {
    // Do nothing
  }
  else {
    this.state.index = this.state.index + 1
    if(this.ImageTag) {
     this.ImageTag.src = "http://localhost:4000/img/"+this.props.name+"/images/"+this.state.ImageNames[this.state.index];
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
   this.ImageTag.src = "http://localhost:4000/img/"+this.props.name+"/images/"+this.state.ImageNames[this.state.index];
    }
  }
  this.outputdiv.innerHTML = "";
}

testSaveText = () =>{
  var data = this.state.ImageNames[this.state.index]+","+ this.outputdiv.innerHTML
  axios.post("http://localhost:8080/saveastextfile",data)
    .then(res => { // then print response status
      console.log(res)
    })
    .catch(err => { // then print response status
    console.log(err)
    })
}

getyolomloutput = () =>{
  var username = this.props.name
  var imagename = this.state.ImageNames[this.state.index]
  var url = "http://localhost:4000/img/"+this.props.name+"/images/"+this.state.ImageNames[this.state.index]
  var mloutputurl = "http://localhost:4000/img/"+this.props.name+"/images/mloutput_"+this.props.name+"_"+imagename
  var data = {'username':username,'imagename':imagename,'imageurl':url,'coordinates':this.outputdiv.innerHTML}

  axios.post("http://localhost:8000/yolo/",data)
    .then(res => { // then print response status
      console.log(res)
      window.open(mloutputurl, '_blank');
    })
    .catch(err => { // then print response status
    console.log(err)
    })
}

getmloutput = () =>{
  var username = this.props.name
  var imagename = this.state.ImageNames[this.state.index]
  var url = "http://localhost:4000/img/"+this.props.name+"/images/"+this.state.ImageNames[this.state.index]
  var mloutputurl = "http://localhost:4000/img/"+this.props.name+"/images/mloutput_"+this.props.name+"_"+imagename
  var data = {'username':username,'imagename':imagename,'imageurl':url}

  axios.post("http://localhost:8000/index/",data)
    .then(res => { // then print response status
      console.log(res)
      window.open(mloutputurl, '_blank');
    })
    .catch(err => { // then print response status
    console.log(err)
    })
}
Apifuncgetimages = (userName) => {
  // data is going to be the username
  axios.post("http://localhost:8080/getimages",userName)
    .then(res => { // then print response status
      console.log(res)
       var ImageNames = res.data["data"].split("</br>");
       ImageNames.pop();
       this.state.ImageNames = ImageNames
         if(this.ImageTag) {
          this.ImageTag.src = "http://localhost:4000/img/"+this.props.name+"/images/"+this.state.ImageNames[this.state.index];
       }
    })
    .catch(err => { // then print response status
    console.log(err)
    })
  }

downloadfiles = () =>{
    axios.post("http://localhost:4000/downloadfiles/",{
      username : this.props.name
    })
      .then(res => { // then print response status
        console.log(res)
        // after creating the zip file, now download
        window.open('http://localhost:4000/img/'+this.props.name+'.zip');
      })
      .catch(err => {
      // then print response status
      console.log(err)
      })
}

wait = (ms) =>{
var d = new Date();
var d2 = null;
do { d2 = new Date(); }
while(d2-d < ms);
}

downloadallfiles = () =>{
  axios.post("http://localhost:4000/downloadallfiles/",{
    username : this.props.name
  })
    .then(res => { // then print response status
      //toast.success('upload success')
      console.log(res)
      // after creating the zip file, now download, delay for zip file creation
      this.wait(5000);
      this.testall();
    })
    .catch(err => {
    // then print response status
    console.log(err)
    })
}

testall = () =>{
  window.open('http://localhost:4000/img/all_'+this.props.name+'.zip');
}

componentDidMount(){
    // Call GO API to get all the image names of username
    this.Apifuncgetimages(this.props.name)
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
        <p>Left Side</p>
          <div ref = {c => this.divCanvas = c} >
          <img className='name' ref = {c => this.ImageTag = c}/>
          </div>
        </div>
        <div className = "columnRight">
        <p>Right Side</p>
          <button type="button" class="buttonclass" onClick={this.NextImage}>NEXT</button>
          <button type="button" class="buttonclass" onClick={this.PrevImage}>PREVIOUS</button>
          <button className="buttonclass" onClick={this.onButton}>ON</button>
          <button className="buttonclass" onClick={this.offButton}>OFF</button>
          <button className="buttonclass" onClick={this.saveastextfile}>SAVE</button>
          <button className="buttonclass" onClick={this.getmloutput}>CHECK TEXTBOX++ ML OUTPUT</button>
          <button className="buttonclass" onClick={this.getyolomloutput}>CHECK YOLO ML OUTPUT</button>

          <button className="buttonclass" onClick={this.downloadfiles}>DOWNLOAD DATA</button>
          <button className="buttonclass" onClick={this.downloadallfiles}>DOWNLOAD ALL</button>
        </div>
        <p hidden ref = {c =>this.outputdiv = c}>
        </p>
      </div>
    );
  }
}

export default WorkingArea;

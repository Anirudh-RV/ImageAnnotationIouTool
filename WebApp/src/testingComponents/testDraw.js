import React, { Component } from 'react';
import './App.css';
import styles from './mystyle.module.css'



class TestDraw extends Component {
//TODO : ADD Footer information

constructor(){
  super();
}

componentDidMount(){
// Onload
this.flag = false;
this.startX = 0;
this.EndX = 0;
this.StartY = 0;
this.EndY = 0;
}

OnButton = () => {
  this.flag = true;
  this.initDraw(this.Canvas,this.flag,);

}
OffButton = () => {
  this.flag= false;
  this.initDraw(this.Canvas,this.flag);
}

initDraw= (canvas,flag) => {
    function setMousePosition(e) {
        var ev = e || window.event; //Moz || IE
        if (ev.pageX) { //Moz
            mouse.x = ev.pageX + window.pageXOffset;
            mouse.y = ev.pageY + window.pageYOffset;
        } else if (ev.clientX) { //IE
            mouse.x = ev.clientX + document.body.scrollLeft;
            mouse.y = ev.clientY + document.body.scrollTop;
        }
    };

    var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    var element = null;

    canvas.onmousemove = function (e) {
      // draw only when flad is On
      if(flag)
      {
        setMousePosition(e);
        if (element !== null) {
            element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
            element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
            element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
            element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
        }
      }
    }

    canvas.onclick = function (e) {
      console.log("ONorOFF : "+flag);
      if(flag)
      {
        if (element !== null) {
            element = null;
            canvas.style.cursor = "default";
            console.log("mouse: ENDX : "+mouse.x)
            console.log("mouse: ENDY : "+mouse.y)
            this.EndX = mouse.x;
            this.EndY = mouse.y;
            console.log("mouse: STARTX : "+this.StartX+"</br>mouse: startY : "+this.StartY+"</br>mouse: ENDX : "+this.EndX+"</br>mouse: ENDY : "+this.EndY);
            console.log("finsihed.");

/* For reading out the coordinates
            if(reading){
              reading= "mouse: STARTX : "+this.StartX+"</br>mouse: startY : "+this.StartY+"</br>mouse: ENDX : "+this.EndX+"</br>mouse: ENDY : "+this.EndY;

            }
            else{
            console.log("mouse: STARTX : "+this.StartX+"</br>mouse: startY : "+this.StartY+"</br>mouse: ENDX : "+this.EndX+"</br>mouse: ENDY : "+this.EndY);
          }
*/
        } else {
            console.log("begun.");
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
            element = document.createElement('div');
            element.className = 'rectangle'
            element.style.left = mouse.x + 'px';
            element.style.top = mouse.y + 'px';
            canvas.appendChild(element)
            canvas.style.cursor = "crosshair";
            console.log("mouse: STARTX : "+mouse.x)
            console.log("mouse: startY : "+mouse.y)
            this.StartX = mouse.x;
            this.StartY = mouse.y;
        }
    }
  }
}

  render() {
    return (
      <div>
      <button className="buttonclass" onClick={this.OnButton}>ON</button>
      <button className="buttonclass" onClick={this.OffButton}>OFF</button>

      <body>
      <div id="canvas"  ref = {c => this.Canvas = c} ></div>
      </body>
     </div>

    );
  }
}
export default TestDraw;

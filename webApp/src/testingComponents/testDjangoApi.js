import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


class TestAPI extends Component {
//TODO : ADD INTRODUCTION TO PROJECT


testdjangoapi = () =>{
  var data = {'username':'new1','imagename':'100.jpg','imageurl':"http://localhost:4000/img/100.jpg"}
  console.log("inside the testdjangoapi function : ")
  axios.post("http://127.0.0.1:8000/index/",data)
    .then(res => { // then print response status
      //toast.success('upload success')
      console.log("API message : ")
      console.log(res)
      console.log(res.data["message"])
      if(this.DataRetrieved) {
       this.DataRetrieved.innerHTML = res.data["message"];
    }

    })
    .catch(err => { // then print response status
    //  toast.error('upload fail')
    console.log("fail")
    console.log(err)
    })
}


testyoloindjango = () =>{
  var data = {'username':'new1','imagename':'people.jpg','imageurl':"http://localhost:4000/img/new1/images/people.jpg"}
  console.log("inside the testdjangoapi function : ")
  axios.post("http://127.0.0.1:8000/yolo/",data)
    .then(res => { // then print response status
      //toast.success('upload success')
      console.log("API message : ")
      console.log(res)
      console.log(res.data["message"])
      if(this.DataRetrieved) {
       this.DataRetrieved.innerHTML = res.data["message"];
    }

    })
    .catch(err => { // then print response status
    //  toast.error('upload fail')
    console.log("fail")
    console.log(err)
    })
}

render() {
    return (
      <div className="App">
      <h1>TESTING API TO DJANGO, check developer tools for console.</h1>
      <pre>

      </pre>
      <button type="button" class="btn btn-success btn-block" onClick={this.testdjangoapi}> TEST TEXTBOX++ TO DJANGO </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testyoloindjango}> TEST YOLO IN DJANGO </button>

      <h1 className='name' ref = {c => this.DataRetrieved = c}></h1>
      </div>
    );
  }
}

export default TestAPI;

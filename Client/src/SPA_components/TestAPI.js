import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


class TestAPI extends Component {
//TODO : ADD INTRODUCTION TO PROJECT


testpromises2 = () =>{
  var check = "";
  function one(callback) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log("first function executed");
      check = check + "first";
      console.log(check);
      resolve();
    }, 250);
  })
}

function three(){
  console.log("third function executed");
  check = check + "third";
  console.log(check);
}
function two() {
  console.log("second function executed");
  check = check + "second";
  console.log(check);
}
one().then(two).then(three);
}

testpromises1 = () =>{

  let myFirstPromise = new Promise((resolve, reject) => {
  // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
  // In this example, we use setTimeout(...) to simulate async code.
  // In reality, you will probably be using something like XHR or an HTML5 API.
  setTimeout( function() {
    resolve("Success!")  // Yay! Everything went well!
  }, 250)
})

myFirstPromise.then((successMessage) => {
  // successMessage is whatever we passed in the resolve(...) function above.
  // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
  console.log("Yay! " + successMessage)
  this.DataRetrieved.innerHTML = "Yay! "+successMessage;
});

}

testApifuncvalidateuser = () =>{
  var data = "email,anirudh.rv1234@gmail.com"
  console.log("inside the testApifuncvalidateuser function : ")
  axios.post("http://localhost:8080/validateinfo",data)
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
testApifuncauthorizeuser = () =>{
  var data = "anirudhr1v,password"
  console.log("inside the authorizeuser function : ")
  axios.post("http://localhost:8080/authorizeuser",data)
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

testApifuncPost = () => {
  console.log("inside the testApifuncPost function : ")
  axios.post("http://localhost:8080/")
    .then(res => { // then print response status
      //toast.success('upload success')
      console.log("API : ")
      console.log(res)
      console.log(res.data["message"])
      if(this.DataRetrieved) {
       this.DataRetrieved.innerHTML = res.data["message"];
    }

    })
    .catch(err => { // then print response status
    //  toast.error('upload fail')
    console.log("fail")
    })
  }


  testApifuncGet = () => {
    console.log("inside the testApifuncGet function : ")
    axios.get("http://localhost:8080/")
      .then(res => { // then print response status
        //toast.success('upload success')
        console.log("API : ")
        console.log(res)
        console.log(res.data["message"])
        if(this.DataRetrieved) {
         this.DataRetrieved.innerHTML = res.data["message"];
      }

      })
      .catch(err => { // then print response status
      //  toast.error('upload fail')
      console.log("fail")
      })
    }


    testApifuncPut = () => {
      console.log("inside the testApifuncPut function : ")
      axios.put("http://localhost:8080/")
        .then(res => { // then print response status
          //toast.success('upload success')
          console.log("API : ")
          console.log(res)
          console.log(res.data["message"])
          if(this.DataRetrieved) {
           this.DataRetrieved.innerHTML = res.data["message"];
        }

        })
        .catch(err => { // then print response status
        //  toast.error('upload fail')
        console.log("fail")
        })
      }

      testApifuncDelete = () => {
        console.log("inside the testApifuncDelete function : ")
        axios.delete("http://localhost:8080/")
          .then(res => { // then print response status
            //toast.success('upload success')
            console.log("API : ")
            console.log(res)
            console.log(res.data["message"])
            if(this.DataRetrieved) {
             this.DataRetrieved.innerHTML = res.data["message"];
          }

          })
          .catch(err => { // then print response status
          //  toast.error('upload fail')
          console.log("fail")
          })
        }

      testApifuncdeleteuser = () => {
        var name = "profoak"
        console.log("inside the testApifuncdeleteuser function : ")
        axios.post("http://localhost:8080/deleteuser",name)
          .then(res => { // then print response status
            //toast.success('upload success')
            console.log("API : ")
            console.log(res)
            console.log(res.data["message"])
            if(this.DataRetrieved) {
             this.DataRetrieved.innerHTML = res.data["message"];
          }

          })
          .catch(err => { // then print response status
          //  toast.error('upload fail')
          console.log("fail")
          })
        }

        testApifuncinsertimagedata = () => {
          // send only strings
          var data = "profoak,frontend1,frontend2,frontend3"
          console.log("inside the testApifuncinsertimagedata function : ")
          axios.post("http://localhost:8080/insertimagedata",data)
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


          testApifuncgetimages = () => {
            // data is going to be the username
            var data = "user1"
            console.log("inside the testApifuncgetimages function : ")
            axios.post("http://localhost:8080/getimages",data)
              .then(res => { // then print response status
                //toast.success('upload success')
                console.log("API : ")
                console.log(res)
                console.log(res.data["data"])
                if(this.DataRetrieved) {
                 this.DataRetrieved.innerHTML = res.data["data"];
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
      <h1>TESTING API, check developer tools for console.</h1>
      <pre>




      </pre>

      <button type="button" class="btn btn-success btn-block" onClick={this.testApifuncPost}> CALL POST </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testApifuncGet}> CALL GET </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testApifuncPut}> CALL PUT </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testApifuncDelete}>  CALL DELETE</button>
      <pre>




      </pre>
      <button type="button" class="btn btn-success btn-block" onClick={this.testApifuncinsertimagedata}> CALL insertimagedata </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testApifuncgetimages}> CALL getimages </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testApifuncdeleteuser}>  DELETE USER (change name in API CALL-incode)</button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testApifuncauthorizeuser}>  CHECK AUTHORIZE USER </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testApifuncvalidateuser}>  Validate Info </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testpromises1}>  Test promises1 </button>
      <button type="button" class="btn btn-success btn-block" onClick={this.testpromises2}>  Test promises2 </button>
      <h1 className='name' ref = {c => this.DataRetrieved = c}></h1>
      </div>

    );
  }
}
export default TestAPI;

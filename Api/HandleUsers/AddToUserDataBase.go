package HandleUsers

import (
    "context"
    "log"
    "net/http"
    "fmt"
    "encoding/json"
)

/*

Write function description here :

*/
func AddUserToDatabase(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusCreated)

  // decoding the message and displaying
  var userdata UserData
  err := json.NewDecoder(r.Body).Decode(&userdata)
     if err != nil {
         http.Error(w, err.Error(), http.StatusBadRequest)
         return
  }
  Email := userdata.Email
  UserName := userdata.UserName
  FullName := userdata.FullName
  Password := userdata.Password

  // setting mongo variables with Collection : UserData

  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"UserData")
  fmt.Println("Connected to MongoDB.")

  structData := UserData{Email,UserName,FullName,Password}
  fmt.Println(structData)
  // To insert a single record
  insertResult, err := collection.InsertOne(context.TODO(), structData)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println("Inserted document: ", insertResult.InsertedID)

  // To close the connection to MongoDB
  err = client.Disconnect(context.TODO())
  if err != nil {
      log.Fatal(err)
  }
  fmt.Println("Connection to MongoDB closed.")

  w.Write([]byte(`{"message": "Yes"}`))
}

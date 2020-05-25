package HandleUsers

import (
    "context"
    "log"
    "net/http"
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

  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"UserData")

  structData := UserData{Email,UserName,FullName,Password}
  // To insert a single record
  _, err = collection.InsertOne(context.TODO(), structData)
  if err != nil {
    log.Fatal(err)
  }

  // To close the connection to MongoDB
  err = client.Disconnect(context.TODO())
  if err != nil {
      log.Fatal(err)
  }

  w.Write([]byte(`{"message": "Yes"}`))
}

package HandleUsers

import (
    "context"
    "log"
    "net/http"
    "encoding/json"

    // MongoDB drivers
    "go.mongodb.org/mongo-driver/bson"
)

/*

Write function description here :

*/
func AuthorizeUser(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)

  // decoding the message and displaying
  var validate validateData
  err := json.NewDecoder(r.Body).Decode(&validate)
     if err != nil {
         http.Error(w, err.Error(), http.StatusBadRequest)
         return
  }
  userName := validate.Field
  passWord := validate.Value

  // setting mongo variables with Collection : UserData
  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"UserData")

  // BSON filter for all documents with a value of name
  var result UserData
  f := bson.M{"username": userName}
  // Call the DeleteMany() method to delete docs matching filter
  err = collection.FindOne(context.TODO(), f).Decode(&result)
  if err != nil {
      // sending back No to react on not being able to find a user
      w.Write([]byte(`{"message": "No"}`))
  }else{
    // To close the connection to MongoDB
    err = client.Disconnect(context.TODO())
    if err != nil {
        log.Fatal(err)
      }
    if userName == result.UserName && passWord == result.Password {
      w.Write([]byte(`{"message": "Yes"}`))
    }else{
    // user not authenticated
      w.Write([]byte(`{"message": "No"}`))
    }
  }
}

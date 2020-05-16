package HandleUsers

import (
    "context"
    "log"
    "net/http"
    "fmt"
    "strings"
    "io/ioutil"

    // MongoDB drivers
    "go.mongodb.org/mongo-driver/bson"
)

/*

Write function description here :

*/
func ValidateInfo(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)

  // decoding the message and displaying
  reqBody, err := ioutil.ReadAll(r.Body)
   if err != nil {
     log.Fatal(err)
   }
  str_name := BytesToString(reqBody)
  splitData := strings.Split(str_name, ",")
  field := splitData[0]
  value := splitData[1]

  fmt.Println(field)
  fmt.Println(value)

  // setting mongo variables with Collection : UserData
  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"UserData")
  fmt.Println("Connected to MongoDB.")

  // BSON filter for all documents with a value of name
  var result User_Data
  f := bson.M{""+field: value}
  fmt.Println("Finding documents with filter:", f)
  // Call the DeleteMany() method to delete docs matching filter
  err = collection.FindOne(context.TODO(), f).Decode(&result)
  if err != nil {
      fmt.Println("No user found.")
      // sending back No to react on not being able to find a user
      w.Write([]byte(`{"message": "No"}`))
  }else{
    fmt.Printf("Found a single document: %+v\n", result)
      // To close the connection to MongoDB
    err = client.Disconnect(context.TODO())
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Connection to MongoDB closed.")
    // sending back yes to react on finding a user
    w.Write([]byte(`{"message": "Yes"}`))
  }
}

package HandleUsers

import (
    "context"
    "log"
    "net/http"
    "fmt"
    "strings"
    "io/ioutil"
)

/*

Write function description here :

*/
func AddUserToDatabase(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusCreated)

  // decoding the message and displaying
  reqBody, err := ioutil.ReadAll(r.Body)
   if err != nil {
     log.Fatal(err)
   }
  fmt.Printf("%s\n", reqBody)

  // splitting data into user_name and an array of image names
  data := BytesToString(reqBody)
  splitData := strings.Split(data, ",")

  Email := splitData[0]
  UserName := splitData[1]
  FullName := splitData[2]
  Password := splitData[3]

  // setting mongo variables with Collection : UserData
  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"UserData")
  fmt.Println("Connected to MongoDB.")

  structData := User_Data{Email,UserName,FullName,Password}
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

package HandleImages

import (
  "context"
  "log"
  "net/http"
  "strings"
  "io/ioutil"
  "fmt"
)
/*

Write function description here :

*/
func AddImagesToDataBase(w http.ResponseWriter, r *http.Request) {
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
  fmt.Println("splitData : ",splitData)
  userName := splitData[0]

  // Opening connection to database

  // setting mongo variables with Collection : ImageNames
  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"ImageNames")
  fmt.Println("Connected to MongoDB.")

  // loop over each entry and insert into database
  for i := 1;i<len(splitData);i++{
    structData := Image_Names{userName,splitData[i]}
    fmt.Println(structData)
    // To insert a single record
    insertResult, err := collection.InsertOne(context.TODO(), structData)
    if err != nil {
      log.Fatal(err)
    }
    fmt.Println("Inserted document: ", insertResult.InsertedID)
  }

  // To close the connection to MongoDB
  err = client.Disconnect(context.TODO())
  if err != nil {
      log.Fatal(err)
  }
  fmt.Println("Connection to MongoDB closed.")
  w.Write([]byte(`{"message": "Success"}`))
}

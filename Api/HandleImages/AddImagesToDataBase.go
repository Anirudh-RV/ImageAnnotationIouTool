package HandleImages

import (
  "context"
  "log"
  "net/http"
  "strings"
  "fmt"
  "encoding/json"
)
/*

Write function description here :

*/
func AddImagesToDataBase(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusCreated)

  // decoding the message and displaying
  var imagedata ImageData
  err := json.NewDecoder(r.Body).Decode(&imagedata)
     if err != nil {
         http.Error(w, err.Error(), http.StatusBadRequest)
         return
  }
  userName := imagedata.UserName
  imagesNames := imagedata.FileNames
  splitData := strings.Split(imagesNames, ",")
  // Opening connection to database

  // setting mongo variables with Collection : ImageNames
  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"ImageNames")
  fmt.Println("Connected to MongoDB.")

  // loop over each entry and insert into database
  for i := 0;i<len(splitData);i++{
    structData := ImageNames{userName,splitData[i]}
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

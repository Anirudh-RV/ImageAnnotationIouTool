package HandleImages

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
func GetImages(w http.ResponseWriter, r *http.Request) {

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)

  // decoding the message and displaying
  var user User
  err := json.NewDecoder(r.Body).Decode(&user)
     if err != nil {
         http.Error(w, err.Error(), http.StatusBadRequest)
         return
  }
  userName := user.UserName

  // QUERYING MONGODB WITH name and returning the results
  // setting mongo variables with Collection : ImageNames
  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"ImageNames")

  // bson.M{} is the fiter that is being used
  filterCursor, err := collection.Find(context.TODO(), bson.M{"name": userName})
  if err != nil {
      log.Fatal(err)
  }

  var ImageNamesFiltered []bson.M
  if err = filterCursor.All(context.TODO(), &ImageNamesFiltered); err != nil {
      log.Fatal(err)
  }

  var imageNames []string
  for i := 0;i<len(ImageNamesFiltered);i++{
    imageNames = append(imageNames,ImageNamesFiltered[i]["imagename"].(string))
  }

  // To close the connection to MongoDB
  err = client.Disconnect(context.TODO())
  if err != nil {
      log.Fatal(err)
  }

  var data CollectedData
  data.Name = userName
  data.ImageNames = imageNames

  imageData, err := json.Marshal(data)
	if err != nil{
		panic(err)
	}

  // return result as a json object
  w.Write(imageData)
}

package HandleImages

import (
  "context"
  "log"
  "net/http"
  "reflect"
  "io/ioutil"
  "fmt"

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
  reqBody, err := ioutil.ReadAll(r.Body)
   if err != nil {
     log.Fatal(err)
   }
  fmt.Printf("Name to be queried : %s\n", reqBody)

  str_name := BytesToString(reqBody)
  fmt.Println(reflect.TypeOf(str_name))

  // QUERYING MONGODB WITH name and returning the results
  // setting mongo variables with Collection : ImageNames
  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"ImageNames")
  fmt.Println("Connected to MongoDB.")

  // add logic here :
  // bson.M{} is the fiter that is being used
  filterCursor, err := collection.Find(context.TODO(), bson.M{"name": str_name})
  if err != nil {
      log.Fatal(err)
  }
  var ImageNamesFiltered []bson.M
  if err = filterCursor.All(context.TODO(), &ImageNamesFiltered); err != nil {
      log.Fatal(err)
  }
  fmt.Print("Length : ")
  fmt.Println(len(ImageNamesFiltered))
  result := ""
  for i := 0;i<len(ImageNamesFiltered);i++{
    fmt.Println(ImageNamesFiltered[i]["img_name"])
    result = result + ImageNamesFiltered[i]["img_name"].(string) + "</br>"
  }

  // To close the connection to MongoDB
  err = client.Disconnect(context.TODO())
  if err != nil {
      log.Fatal(err)
  }
  fmt.Println("Connection to MongoDB closed.")
  // return result as a json object
  w.Write([]byte(fmt.Sprintf(`{"data":"%s"}`, result)))
}

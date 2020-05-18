package HandleUsers

import (
    "log"
    "net/http"
    "fmt"
    "io/ioutil"
    "context"

    // MongoDB drivers
    "go.mongodb.org/mongo-driver/bson"

)

/*

Write function description here :

*/
func DeleteUser(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)

    // decoding the message and displaying
    reqBody, err := ioutil.ReadAll(r.Body)
    if err != nil {
      log.Fatal(err)
    }
    fmt.Printf("%s\n", reqBody)
    name := BytesToString(reqBody)

    // setting mongo variables with Collection : ImageNames
    clientOptions := GetClientOptions()
    client := GetClient(clientOptions)
    collection := GetCollection(client,"ImageNames")
    fmt.Println("Connected to MongoDB.")

    // BSON filter for all documents with a value of name
    f := bson.M{"name": name}
    fmt.Println("Deleting documents with filter:", f)
    // Call the DeleteMany() method to delete docs matching filter
    res, err := collection.DeleteMany(context.TODO(), f)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(res)

    // To close the connection to MongoDB
    err = client.Disconnect(context.TODO())
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Connection to MongoDB closed.")
    w.Write([]byte(`{"message": "Success"}`))
}

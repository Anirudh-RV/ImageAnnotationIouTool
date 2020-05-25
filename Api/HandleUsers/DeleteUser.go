package HandleUsers

import (
    "log"
    "net/http"
    "context"
    "encoding/json"

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
    // decoding the message and displaying
    var validate validateData
    err := json.NewDecoder(r.Body).Decode(&validate)
       if err != nil {
           http.Error(w, err.Error(), http.StatusBadRequest)
           return
    }
    name := validate.Field

    // setting mongo variables with Collection : ImageNames
    clientOptions := GetClientOptions()
    client := GetClient(clientOptions)
    collection := GetCollection(client,"ImageNames")

    // BSON filter for all documents with a value of name
    f := bson.M{"name": name}
    // Call the DeleteMany() method to delete docs matching filter
    _, err = collection.DeleteMany(context.TODO(), f)
    if err != nil {
        log.Fatal(err)
    }

    // To close the connection to MongoDB
    err = client.Disconnect(context.TODO())
    if err != nil {
        log.Fatal(err)
    }
    w.Write([]byte(`{"message": "Success"}`))
}

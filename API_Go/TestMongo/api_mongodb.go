package main

import (
    "context"
    "fmt"
    "log"
    "reflect"


    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type Image_Names struct {
    Name  string
    Img_Name string
}
/*
func insertmultiplerecords(){
// functioning method

  ash := Image_Names{"ash", "ash_image2"}
  misty := Image_Names{"misty", "misty_image1"}
  brock := Image_Names{"brock", "brock_image1"}


    // To insert multiple records, make an interface and the insertion will be done by slicing each input

    multiple := []interface{}{misty, brock, ash}

    insertManyResult, err := collection.InsertMany(context.TODO(), multiple)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Inserted multiple documents: ", insertManyResult.InsertedIDs)
}
func insertsinglerecord(){
// functioning method

  ash := Image_Names{"ash", "ash_image1"}
  misty := Image_Names{"misty", "misty_image1"}
  brock := Image_Names{"brock", "brock_image1"}


  // To insert a single record
  insertResult, err := collection.InsertOne(context.TODO(), ash)
  if err != nil {
      log.Fatal(err)
  }

  fmt.Println("Inserted a single document: ", insertResult.InsertedID)

}


func search(){

// bson.M{} is the fiter that is being used
  filterCursor, err := collection.Find(context.TODO(), bson.M{"name": "ash"})
  if err != nil {
      log.Fatal(err)
  }
  var ImageNamesFiltered []bson.M
  if err = filterCursor.All(context.TODO(), &ImageNamesFiltered); err != nil {
      log.Fatal(err)
  }

//fmt.Println(ImageNamesFiltered)
//fmt.Println(len(ImageNamesFiltered))
//fmt.Println(reflect.TypeOf(ImageNamesFiltered))

  for i := 0;i<len(ImageNamesFiltered);i++{
    fmt.Println(ImageNamesFiltered[i]["img_name"])
  }

}
*/
func main() {
    // Rest of the code will go here
    // Set client options
    clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")

    // Connect to MongoDB
    client, err := mongo.Connect(context.TODO(), clientOptions)

    if err != nil {
        log.Fatal(err)
    }

    // Check the connection
    err = client.Ping(context.TODO(), nil)

    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Connected to MongoDB!")

// Handling the collection ImageNames in Database GoDB
  collection := client.Database("GoDB").Collection("ImageNames")

// add logic here :

// To close the connection to MongoDB
  err = client.Disconnect(context.TODO())

  if err != nil {
      log.Fatal(err)
  }
  fmt.Println("Connection to MongoDB closed.")

}

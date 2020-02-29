package main

import (
    "context"
    "log"
    "net/http"
    "strings"
    "fmt"
    "io/ioutil"
    "reflect"
    "unsafe"
    "os"

    // handles url/redirection
    "github.com/gorilla/mux"
    "github.com/gorilla/handlers"
    // MongoDB drivers
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type SentData struct {
	data string
}

type User_Data struct{
  Email string
  UserName string
  FullName string
  Password string
}

type Image_Names struct {
    Name  string
    Img_Name string
}

// Mongo Connection functions
func GetClientOptions() *options.ClientOptions {
  clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
  return clientOptions
}

func GetClient (clientOptions *options.ClientOptions) *mongo.Client{
  client, err := mongo.Connect(context.TODO(), clientOptions)
  if err != nil {
    log.Fatal(err)
  }
  return client
}

func GetCollection (client *mongo.Client,collectionname string) *mongo.Collection{
  collection := client.Database("GoDB").Collection(collectionname)
  return collection
}

// to convert Byte to string
func BytesToString(b []byte) string {
    bh := (*reflect.SliceHeader)(unsafe.Pointer(&b))
    sh := reflect.StringHeader{bh.Data, bh.Len}
    return *(*string)(unsafe.Pointer(&sh))
}

func get(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"message": "GET called"}`))
}

func post(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    w.Write([]byte(`{"message": "POST called"}`))
}

func put(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusAccepted)
    w.Write([]byte(`{"message": "PUT called"}`))
}

func delete(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"message": "Delete called"}`))
}

func notFound(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusNotFound)
    w.Write([]byte(`{"message": "not found"}`))
}

// uses POST request
func getimages(w http.ResponseWriter, r *http.Request) {

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

// uses POST request
func addimagetodatabase(w http.ResponseWriter, r *http.Request) {
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

func deleteuser(w http.ResponseWriter, r *http.Request) {
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

func saveastextfile(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)

  // decoding the message and displaying
  reqBody, err := ioutil.ReadAll(r.Body)
   if err != nil {
     log.Fatal(err)
   }
  str_name := BytesToString(reqBody)
  str_name = strings.ReplaceAll(str_name, ".jpeg", "")
  str_name = strings.ReplaceAll(str_name, "</br>", "")
  str_name = strings.ReplaceAll(str_name,"&emsp;","  ")
  str_name = strings.ReplaceAll(str_name, "<br>", "")

  splitData := strings.Split(str_name, ",")
  imageName := splitData[0]
  imageData := splitData[1]
  imageData = strings.ReplaceAll(imageData, "|", ",")

  // making text file and saving data in it.
  f, err := os.Create(imageName+".txt")
  if err != nil {
      fmt.Println(err)
      return
  }
  l, err := f.WriteString(imageData)
  if err != nil {
      fmt.Println(err)
      f.Close()
      return
  }
  fmt.Println(l, "bytes written successfully")
  err = f.Close()
  if err != nil {
      fmt.Println(err)
      w.Write([]byte(`{"message": "FAIL"}`))
  }
  w.Write([]byte(`{"message": "saveastextfile called successfully"}`))
}

func authorizeuser(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)

  // decoding the message and displaying
  reqBody, err := ioutil.ReadAll(r.Body)
   if err != nil {
     log.Fatal(err)
   }
  str_name := BytesToString(reqBody)
  splitData := strings.Split(str_name, ",")
  userName := splitData[0]
  passWord := splitData[1]

  // setting mongo variables with Collection : UserData
  clientOptions := GetClientOptions()
  client := GetClient(clientOptions)
  collection := GetCollection(client,"UserData")
  fmt.Println("Connected to MongoDB.")

  // BSON filter for all documents with a value of name
  var result User_Data
  f := bson.M{"username": userName}
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

    if userName == result.UserName && passWord == result.Password {
      fmt.Println("User authenticated")
      w.Write([]byte(`{"message": "Yes"}`))
    }else{
    // user not authenticated
      fmt.Println("User not authenticated")
      w.Write([]byte(`{"message": "No"}`))
    }
  }
}

func validateinfo(w http.ResponseWriter, r *http.Request) {
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

func addusertodatabase(w http.ResponseWriter, r *http.Request) {
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


func main() {
    r := mux.NewRouter()
    r.HandleFunc("/", get).Methods(http.MethodGet) //65
    r.HandleFunc("/", post).Methods(http.MethodPost) //71
    r.HandleFunc("/", put).Methods(http.MethodPut) //77
    r.HandleFunc("/", delete).Methods(http.MethodDelete) // 83
    r.HandleFunc("/", notFound) // 89

    r.HandleFunc("/getimages", getimages).Methods(http.MethodPost) //97
    r.HandleFunc("/insertimagedata",addimagetodatabase).Methods(http.MethodPost) // 149
    r.HandleFunc("/deleteuser",deleteuser).Methods(http.MethodPost) // 197
    r.HandleFunc("/saveastextfile",saveastextfile).Methods(http.MethodPost) // 235
    r.HandleFunc("/authorizeuser",authorizeuser).Methods(http.MethodPost) // 280
    r.HandleFunc("/validateinfo",validateinfo).Methods(http.MethodPost) // 331
    r.HandleFunc("/addusertodatabase",addusertodatabase).Methods(http.MethodPost) // 377

    // To Handle CORS (Cross Origin Resource Sharing)
    headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
    methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS","DELETE"})
    origins := handlers.AllowedOrigins([]string{"*"})

    fmt.Println("Running on port : 8080")
    log.Fatal(http.ListenAndServe(":8080",handlers.CORS(headers,methods,origins)(r)))
}

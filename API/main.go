package main

import (
    "log"
    "net/http"
    "fmt"

    // handles url/redirection
    "github.com/gorilla/mux"
    "github.com/gorilla/handlers"

     RestMethods "./RestMethods"
     HandleImages "./HandleImages"
     HandleUsers "./HandleUsers"
)

func main() {
    r := mux.NewRouter()

    r.HandleFunc("/", RestMethods.Get).Methods(http.MethodGet) //65
    r.HandleFunc("/", RestMethods.Post).Methods(http.MethodPost) //71
    r.HandleFunc("/", RestMethods.Put).Methods(http.MethodPut) //77
    r.HandleFunc("/", RestMethods.Delete).Methods(http.MethodDelete) // 83
    r.HandleFunc("/", RestMethods.NotFound) // 89

    r.HandleFunc("/getimages", HandleImages.GetImages).Methods(http.MethodPost) //97
    r.HandleFunc("/insertimagedata",HandleImages.AddImagesToDataBase).Methods(http.MethodPost) // 149

    r.HandleFunc("/deleteuser",HandleUsers.DeleteUser).Methods(http.MethodPost) // 197
    r.HandleFunc("/saveastextfile",HandleUsers.SaveAsTextFile).Methods(http.MethodPost) // 235
    r.HandleFunc("/authorizeuser",HandleUsers.AuthorizeUser).Methods(http.MethodPost) // 280
    r.HandleFunc("/validateinfo",HandleUsers.ValidateInfo).Methods(http.MethodPost) // 331
    r.HandleFunc("/addusertodatabase",HandleUsers.AddUserToDatabase).Methods(http.MethodPost) // 377

    // To Handle CORS (Cross Origin Resource Sharing)
    headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
    methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS","DELETE"})
    origins := handlers.AllowedOrigins([]string{"*"})

    fmt.Println("Testing-Running on port : 8080")
    log.Fatal(http.ListenAndServe(":8080",handlers.CORS(headers,methods,origins)(r)))
}

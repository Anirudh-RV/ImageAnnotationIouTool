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

    r.HandleFunc("/", RestMethods.Get).Methods(http.MethodGet)
    r.HandleFunc("/", RestMethods.Post).Methods(http.MethodPost)
    r.HandleFunc("/", RestMethods.Put).Methods(http.MethodPut)
    r.HandleFunc("/", RestMethods.Delete).Methods(http.MethodDelete)
    r.HandleFunc("/", RestMethods.NotFound)

    r.HandleFunc("/getimages", HandleImages.GetImages).Methods(http.MethodPost)
    r.HandleFunc("/insertimagedata",HandleImages.AddImagesToDataBase).Methods(http.MethodPost)

    r.HandleFunc("/deleteuser",HandleUsers.DeleteUser).Methods(http.MethodPost)
    r.HandleFunc("/authorizeuser",HandleUsers.AuthorizeUser).Methods(http.MethodPost)
    r.HandleFunc("/validateinfo",HandleUsers.ValidateInfo).Methods(http.MethodPost)
    r.HandleFunc("/addusertodatabase",HandleUsers.AddUserToDatabase).Methods(http.MethodPost)

    // To Handle CORS (Cross Origin Resource Sharing)
    headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
    methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS","DELETE"})
    origins := handlers.AllowedOrigins([]string{"*"})

    fmt.Println("Running on port : 8080")
    log.Fatal(http.ListenAndServe(":8080",handlers.CORS(headers,methods,origins)(r)))
}

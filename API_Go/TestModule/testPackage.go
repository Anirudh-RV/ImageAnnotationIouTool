package TestModule

import (
  "net/http"
  "fmt"
)

// This func must be Exported, Capitalized, and comment added.
func Printhello(w http.ResponseWriter, r *http.Request) {
  fmt.Println("In TestModule/testpackage.go : ")

  w.Write([]byte(`{"message": "Yes"}`))
}

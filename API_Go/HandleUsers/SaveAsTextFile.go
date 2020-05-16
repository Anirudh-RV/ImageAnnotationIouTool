package HandleUsers

import (
    "log"
    "net/http"
    "fmt"
    "strings"
    "io/ioutil"
    "os"
)

/*

Write function description here :

*/
func SaveAsTextFile(w http.ResponseWriter, r *http.Request) {
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
  w.Write([]byte(`{"message": "SaveAsTextFile called successfully"}`))
}

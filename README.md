# Introduction to ImageAnnotationIoUTool

**Technologies used**
1. ReactJs for Frontend (3000)
2. NodeJs for Backend (4000)
3. Django to run the Machine learning algorithms in the background (8000)
4. Golang for running GO API's to connect the application with the Database (8080)
5. MongoDB as NoSQL Database (27017)
6. OpenCV for drawing boxes and checking IoU and for dividing the video into frames
7. DarkFlow for running yolo9000
8. tensorflow, numpy, keras for assisting the machine learning application
9. matplotlib is being used for testing images (display of images)
10. Vanilla Js for functions and bits of React code

**How it works**

*Downloading and processing video :*
1. If a video is already available, place it in the main folder or download a video from YouTube(Y2 downloader or In-House application)
2. Run the dividevideo.py to split the video into frames at random intervals between 2-5 seconds (considering 30 fps)
3. The divided frames will be available in the Dividedframes folder

*Annotation System :*
1. The user signs up into the system by giving email,username,name and password
2. Once the signUp is successful, the user is redirected to the upload page
3. The user can upload upto 99 images at once and click viewimages
4. Upon succeful upload of the images, the user is redirected to the EditPage
5. EditPage contains the NavigationBar and the WorkingArea
6. The user can draw boxes around the subject of interest and click save
7. Upon clicking save, the coordinates of the boxes drawn will be saved in the backend
8. The User has two options to check the IoU :
  a. Check IoU at each image :
    1. The user can click on Check ml output yolo to check the IoU for that particular file
    2. Continue this process for each image and the individual IoU's will be saved in the IoU folder in IoU.txt
    3. Download/DownloadAll depending on the nature of output needed
      I.Download will only download the annotations
      II.DownloadAll will download the images,mloutputs,annotations,IoU and any aditional data present
  b. Continue the annotations for all images and check IoU together
    1. The user can just keep annotating images to have a smooth workflow
    2. DownloadAll once the annotations are done
    3. Place the images and the output in the checkIoU folder
    4. Run iou.py to check the IoU of all images and store it in the IoU folder in IoU.txt
9. The output of the machine learning algorithms can be seen by running checkmloutput.py, images will be stored in the mlimages folder



# ImageAnnotationIoUTool : Application Phase-2 COMPLETE (Temporarily halted till phase-3 technology is learnt)
How to start the application :

# TO CHECK IOU FOR TXT FILES AND IMAGES
1. Copy images into checkIoU folder
2. Copy output into checkIoU folder
3. Change variables in the iou.py folder
4. Run file
5. Clear folders for next iteration of images

# ERRORS :
1. wrong credential go server crashes, fix it
2. Download not happening through nodeserver
3. Dividevideo file does not check if Dividedframes folder exists

# NEVER PUSH OR COMMIT WITH WEIGHTS IN THE FOLDER

# Steps to run the application (may involve downloading mongo,go libraries and setting up django environment)
1. clone the git
2. Download both weights from :
  https://drive.google.com/drive/folders/1pW4mKNOzOIf0Edyr4BppwnLpddCQ6Qch?usp=sharing

  https://drive.google.com/open?id=1JupZYcQO7Jh5aiRQLwNzYZaX0uYGULdK

3. Place the weights in the Django/mlbackend folder with the other .py files

Reactjs : 3000
1. cd Client
2. npm install
3. npm start

Go API: 8080
1. cd API_Go
2. go run main.go

Django: 8000
1. cd pythonbackend
2. cd djangobackend
3. python3 manage.py runserver

NodeServer: 4000
1. cd NodeServer
2. node server.js

# if npm build is failing, install by : npm install <absent library>

For building yolo9000 :
$ pip install Cython
$ git clone https://github.com/thtrieu/darkflow.git
$ cd darkflow
$ python3 setup.py build_ext --inplace
$ pip install .
# anywhere in the system

To get mongo working :
1. use GoDB
2. db.createCollection("ImageNames")
3. db.createCollection("UserData")

Have fun
########--------------------------------------------------------------------------------------------------

General guide : To Kill Ports : lsof -P | grep ':8000' | awk '{print $2}' | xargs kill -9

Reactjs :

Figure this out or copy paste previous projects NodeServe :

Copy the Server.js Copy the pacakage-lock.json npm install Django :

django-admin startproject mysite cd mysite python3 manage.py startapp polls python3 manage.py runserver templates :

cd polls mkdir templates touch index.html extras: Add static paths in settings.py Add the installed apps in settings.py Add the cross origin request corsheaders in installed apps http://www.srikanthtechnologies.com/blog/python/enable_cors_for_django.aspx


**LOC and program list :**
1. main.go : 437
2. CustomRouting.js : 53
3. EditPage.js : 23
4. Error.js : 27
5. Footer.js : 14
6. Home.js : 17
7. IntroBar.js : 197
8. Routes.js : 63
9. Signin.js : 73
10. SignUp.js : 233
11. Test_Cookies.js : 53
12. TestApi.js : 282
13. TestDjango.js : 46
14. TestNodeApi.js : 116
15. UploadMultipleFiles.js : 164
16. WorkingArea.js : 257
17. Views.py : 320
18. Server.js : 127
19. checkmloutput.py : 45
20. iou.py : 177
21. dividevideo.py : 68

LOC : 2812

To count files :
ls -F |grep -v / | wc -l

To run build in production :
serve -s build -l 3000

// git :
to check number of lines :

all files :
git ls-files | xargs wc -l

only the grep (go) files :
git ls-files | grep '\.go' | xargs wc -l

limits to 5 :
git ls-files | grep '\.go' | xargs wc -l | head -n 5

save output in file :
git ls-files | xargs wc -l >> LOC.txt

//API CALLS :
POST : create new record in the database
GET  : Read from database
PUT : Update/Replace row in database
PATCH : Update/Modify row in database
DELETE : delete row in database

Extended :
GET : The GET method requests a representation of the specified resource. Requests using GETshould only retrieve data.
HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body.
POST : The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
PUT : The PUT method replaces all current representations of the target resource with the request payload.
DELETE : The DELETE method deletes the specified resource.
CONNECT : The CONNECT method establishes a tunnel to the server identified by the target resource.
OPTIONS : The OPTIONS method is used to describe the communication options for the target resource.
TRACE : The TRACE method performs a message loop-back test along the path to the target resource.
PATCH : The PATCH method is used to apply partial modifications to a resource.

Good practices for user accounts :
https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account

// DONE :
1. Figure out how to save the images that are uploaded on a custom directory, rather than just in public.
2. Have a Image holder in the WorkingArea of the webpage for viewing all the photos, add arrow marks to go through
the directory of images for that particular user.
3. Have Separate user login.
4. Manage different user data.
5. conflicting names of the images are taken care of, while saving.
7. Drawing rectangles in the image
8. To save the coordinates of the rectangles drawn on the image, in a .txt file with a pre-determined naming scheme
9. SignUp and SignIn functionality
10. Restrict direct access to routes
11. Validating boxes drawn in the website.
  a. y-offset of 125px founds
  b. corrected by subtracting 125 from final Y-value to save.
  c. Validate_Draw created
  d. A python file created to draw boxes and check if the rectangles fit.

***END OF PHASE-1***
13. Adding ML model using Django backend (Static),Process images sent by the frontend and send output back (Dynamic)

// Optional :
6. Preprocess of images to size 512,512 / user given resolution.

**// TODO : (PHASE - 2)**
12. Make changes in the UI
  a. Change dropdown
  b. Change position of react elements
  c. complete UI overhaul

14. Add download functionality for the text files/pictures saved
15. Clean code and make code fit for production

***END OF PHASE-2*** (COMPLETED)

**// TODO : (PHASE - 3)**

NOTE : Look at error in ***IMPORTANT*** NOTE : PROBLEMS WITH ML MODEL IN PREDICTING OUTPUT FIX ASAP (FIXED)
NOTE : To make the website secure -
          a. Hash the passwords
          b. Hash the cookie names
          c. Hash the keywords for entry
          d. Check with the server before allowing entry
          e. Protect routes and username and information

16. Deploy website

***END OF PHASE-3***

React redirection map : Routes set by CustomRouting file for restricted access, the routing may vary on user status.
user status :
1. Logged in
2. Not logged in

          Index.js -> Routes.js //(Has different routes)
                        |
                        |
                        |
                        v
        ==================================
        |               |                |
        Home          EditPage         UploadFile
                        ^
                        |
                        |
NavigationBar ----------
(Separate Component)

########--------------------------------------------------------------------------------------------------
to accomplish requirement: 1 (COMPLETE)
1. Figure out how to save the images that are uploaded on a custom directory, rather than just in public.
How to load Images : Being Done using UploadMultipleFiles and Server.js


END OF 1st REQUIREMENT
########--------------------------------------------------------------------------------------------------
to accomplish requirement: 2 (COMPLETE)
2. Have a Image holder in the WorkingArea of the webpage for viewing all the photos, add arrow marks to go through
the directory of images for that particular user.

How to upload images and retrieve dynamically :

Uploading : upload has 2 different parts, uploading the actual images into backend(NodeJS) and uploading the names of the images that were successfully uploaded using an Api to a backend database

1. Upload the images using UploadMultipleFiles and server.js using json and a post requests
2. Use an Api call to add names of the images being uploaded into a database.

Retrieval :
1. Get names of the images in the database by using an Api call.
2. Load those images using the location of the images.
3. Dynamic loading will happen when each image needs it's own Api call to get the name
4. Start from the first image, call Api for only the first image name, then as the user proceeds, call for other images.
// will help in maintaining speed and will not load too many images to the local working environment.

Api to use : Go / Java (prefer Go)
Database to use : SQL


// Next : Learn how to make Api using Golang.
API: Application Programming Interface using Golang

POST REQUEST
Webpage (Send data) -----> API ------> Backend (SQL) (Store Data)

GET REQUEST

webpage (Request data)  --------> API ----------> Backend (SQL)
webpage (Get data)      <---------API <---------- (Fetch data)

Work for API:

Completed :
1. Go server setup which handles requests and returns a json object.
2. Axios request from frontend
3. Displays data returned from API on the frontend
4. Test out sending basic data to the POST method from frontend
  a.Manipulate data in GO backend and send back response
  b.Show the result on the frontend
  c.String data is being sent from reactjs frontend using an axios post request, the data
    is then read by the go backend and converted into UPPERCASE and then sent back as a
    json object. This json object is being displayed in the frontend

//TODO : (for sql //current version uses mongoDB)
1. Connect Go to an SQL server and handle the requests with the API.This includes:
  a. Inserting Image names into the Database
  b. Retrieving Image names from the database (One name / all the names)
  c. Retrieval must be done according to the user and only the images a particular user has uploaded.

Work for Database:

NOTE : currently using mongodb as the database for storing names, simpler solution than setting up a mysql Database
in MacOS.

Completed :
1. Integrate Go with SQL/mongodb (Test functions for inserting and searching completed)
2. Make SQL/mongodb database with 3 columns,
  a. Sl.no (Serial number)
  b. Name of the user
  c. Name of the Image
3. Method for Search function completed.
  a. API call from frontend with POST request with the name of the user
  b. Connection to mongodb and searching all the inputs of the user (Using filters)
  c. Returning the queried result in json format back to frontend
  d. Display of result in frontend
4. Inserting into database from frontend (Test)
5. Delete function (deleteuser) for deleting any user from the database
6. 1. Try the API functionality from the actual webpage
  a. Inserting image names and the username
7. Username is being sent to nodejs backend and the images are being saved as :
  <user-name>"____"<image-name>
8. Redirect to EditPage after Image upload with the user information
9. How to retrieve the names of the user from the actual webpage
10. How to have image holders for the user's images
11. Arrow marks to navigate through the images

NOTE :
// to be done in next project : Login with sessionID, cookies and authenticating using JWT
Figure out how to save the images with the username in it, in the folder.
 a. How to maintain login information throughout the environment.
 b. Use the username to change information specific to the user accordingly
 The JWT (Json Web Token) is widely used in authenticating Web applications developed using advanced Javascript frameworks : Angularjs or Reactjs(with supporting libraries)

END OF 2nd REQUIREMENT
########--------------------------------------------------------------------------------------------------
to accomplish requirement: 3 (COMPLETE)
3. Have Separate user login.
  a. Separate login page created

END OF 3rd REQUIREMENT
########--------------------------------------------------------------------------------------------------
to accomplish requirement: 4 (COMPLETE)
4. Manage different user data
  a.Same folder, different names, mongoDB is used to save different user's image names.

END OF 4th REQUIREMENT
########--------------------------------------------------------------------------------------------------
to accomplish requirement: 5 (COMPLETE)

5. conflicting names of the images are taken care of, while saving. (COMPLETE)

END OF 5th REQUIREMENT
########--------------------------------------------------------------------------------------------------
to accomplish requirement: 6

6. Preprocess of images to size 512,512 / user given resolution. (Optional)

END OF 6th REQUIREMENT
########--------------------------------------------------------------------------------------------------
to accomplish requirement: 7 (COMPLETE)

7. Drawing rectangles in the image

// DONE :
1. Having an ON/OFF button to start/stop drawing.
2. For drawing rectangles and displaying their coordinates in the console.
3. Applying the TEST code to the actual images webpage.
4. Erase rectangles drawn when a new image loads.(Done by erasing div and adding back the elements)

END OF 7th REQUIREMENT
########--------------------------------------------------------------------------------------------------
to accomplish requirement : 8 (COMPLETE)

8. To save the coordinates of the rectangles drawn on the image, in a .txt file with a pre-determined naming scheme

// DONE :
1. Gather all the coordinates of each rectangle drawn in one variable
  a. Made a div tag which displays to the user the coordinates
2. On pressing next image, save this data in a text file (.txt) and save in the local folder
  a. The div tags innerHTML is being taken when next image is pressed.
3. Using the Go server, an axios post request is sent with the data and a text file is saved.

END OF 8th REQUIREMENT
########--------------------------------------------------------------------------------------------------
to accomplish requirement : 9 (COMPLETE)

9. SignUp and SignIn functionality

// DONE :
1. Template for SignUp
2. Template for SignIn
3. Have a SignUp option
    a. Gather all the data and check for previously existing users
    b. If available then allow to continue
    c. Login

4. Authenticate SignIn
  a. Check for the username / the email
  b. Authenticate the password
  c. Login

// TODO:
3. Maintain SignIn throughout the Session / till SignOut

  a. Maintaining signin through cookies

NOTE : Use JWT token and hash passwords when deploying actual website
NOTE : Use MongoDB for checking and Go API for connection, check JWT for authentication
NOTE : Make sure the data transfer is secure and is done, how it is supposed to be done.
NOTE : Can try encryption, but during later phases of the project
NOTE : Can try login through Facebook, Google

1. Both requirement 9,10 together, need to make sign in consistent and restrict direct access

########--------------------------------------------------------------------------------------------------
to accomplish requirement : 10 (COMPLETE)

10. Restrict direct access to routes

// DONE :
1. static restriction of routes being done.(only for user anirudhrv)
2. Dynamic restriction of routes done.(only allows users in the MongoDB collection - ImageNames)
  a. Check for users in Signin.js and return a key to the CustomRouting.
  b. let CustomRouting check the key and then redirect the user to the actual webpage.


NOTE : PROBLEM WITH CONSISTENT LOGIN NEEDS TO BE FIXED, USE SESSIONS AND COOKIES.LOGOUT OPTION NEEDS TO BE DONE.
(DONE USING COOKIES)

NOTE : PROJECT SIGNUP AND LOGIN AND CONSISTENT LOGIN OF USER ONLY DONE UNDER PHASE-1, FURTHER IMPROVEMENTS NEEDED IN PHASE-2.
########--------------------------------------------------------------------------------------------------
to accomplish requirement : 13 (COMPLETE)

13. Adding ML model using Django backend (Static),Process images sent by the frontend and send output back (Dynamic)

NOTE :
1. Use tensorflow 1.12.0
2. Use Keras 2.2.4
3. Use python3 manage.py runserver (Python3 uses 3.6.5, 3.7/3.8 are not compatible with the tensorflow versions needed)

//DONE :
1. Basic working of the ML model on call of a function
2. Test frontend testdjango api working
3. Let frontend call the Django backend with information about image
4. Backend runs the image and saves as output in node server / Backend runs image and saves the coordinates
5. Frontend can see the image processed by the ML model

***IMPORTANT***

NOTE : PROBLEMS WITH ML MODEL IN PREDICTING OUTPUT FIX ASAP (FIXED)
  a. PIL image type had to be converted into numpy array for ML model to work

NOTE : PNG FILES NOT WORKING WITH ML OUTPUT, DIMENSIONS ARE NOT RIGHT
  a. Use jpeg files or
  b. fix the size/dimensions issue

NOTE : FILE BEING UPLOADED IS COLOUR CORRECTED (BLUE SPECTRUM)
  a. Check problem with opening the image as a file
  b. Find alternative methods of sending the image to the NODE backend.
***IMPORTANT***

########--------------------------------------------------------------------------------------------------
to accomplish requirement : 14 (COMPLETE)

14. Add download functionality for the text files/pictures saved

DONE:
1. Download of a zip file containing the txt files
2. Integrate with production
3. Make the functionality dynamic
4. Download images
  a. Store the users images in separate folders inside the upload folder
  b. Have an option to download even the base images in case of remote users

########--------------------------------------------------------------------------------------------------
to accomplish requirement : 15 (COMPLETE)

15. Clean code and make code fit for production

########--------------------------------------------------------------------------------------------------
to accomplish requirement : 16

16. Deploy website

//TODO:
1. Figure out how to deploy website, Maybe use docker and AWS. Try out what kubernetes has to offer.

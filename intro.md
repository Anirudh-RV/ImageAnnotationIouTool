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

*How it works*

Downloading and processing video :
1. If a video is already available, place it in the main folder or download a video from YouTube(Y2 downloader or In-House application)
2. Run the dividevideo.py to split the video into frames at random intervals between 2-5 seconds (considering 30 fps)
3. The divided frames will be available in the Dividedframes folder

Annotation System :
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

LOC and program list if needed :
main.go : 437
CustomRouting.js : 53
EditPage.js : 23
Error.js : 27
Footer.js : 14
Home.js : 17
IntroBar.js : 197
Routes.js : 63
Signin.js : 73
SignUp.js : 233
Test_Cookies.js : 53
TestApi.js : 282
TestDjango.js : 46
TestNodeApi.js : 116
UploadMultipleFiles.js : 164
WorkingArea.js : 257
Views.js : 145
Server.js : 110
checkmloutput.py : 45
iou.py : 177
dividevideo.py : 68

LOC : 2620  
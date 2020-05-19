# AnnotationTool

# Steps to run the application
**Prerequisites**
1. Download mongo
2. Download GO and Go libraries using go get *link of library*
3. setting up Django environment
  a. Download and run yolo9000
  b. Download and run TextBox++

**To run**
1. clone the git
2. Download both weights from :
  1. https://drive.google.com/drive/folders/1pW4mKNOzOIf0Edyr4BppwnLpddCQ6Qch?usp=sharing

  2. https://drive.google.com/open?id=1JupZYcQO7Jh5aiRQLwNzYZaX0uYGULdK

3. Place the weights in the Django/mlbackend folder with the other .py files

**WebApp (Reactjs) : port-3000**
1. cd Client
2. npm install
3. npm start

**API (Golang): port-8080**
1. cd API_Go
2. go run main.go

**MLSystem (Django): port-8000**
1. cd pythonbackend
2. cd djangobackend
3. python3 manage.py runserver

**Server (NodeJS): port-4000**
1. cd NodeServer
2. npm install
3. npm install express-zip
4. npm install multer
5. npm install zip-folder
6. npm install cors
7. npm install express
8. npm install serve-index
9. node server.js

**if npm build is failing, install by : npm install <absent library>**

**For building yolo9000 :**
1. pip install Cython
2. git clone https://github.com/thtrieu/darkflow.git
3. cd darkflow
4. python3 setup.py build_ext --inplace
5. pip install .

**To setup mongo collections :**
1. use GoDB
2. db.createCollection("ImageNames")
3. db.createCollection("UserData")

# About

**Feature list**
1. Upload Video
2. Upload photos
3. Draw boxes
4. Check IoU
5. Check ML output image
6. Save output in .txt format
7. Download ZIP
  a. Images
  b. Annotations
  c. IoU
  d. ML output

**Process of measuring IoU**
1. Each bounding box with label : "people" is considered (Iterated through)
2. The bounding box is checked with all the ground truths for IoU
3. The maximum IoU is considered for that bounding box (non-max suppression)
4. The above process is repeated for each bounding box detected by the YOLO algorithm
5. To add the possibility that people in the ground truth are completely ignored by the yolo algorithm
  a.The difference between the number of people detected by yolo and the number of people annotated for ground truth is considered
  b.This is added as extra 0's to the list of the IoU's
6. The average of all the maximum IoU's of each bounding box and the additional 0's is taken for overall IoU for an image
7. The average of all the IoU's for each image is taken as the average IoU for the dataset (~400 images)
8. check code in CheckIoU/iou.py for source code

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
11. Docker
12. AWS EC2
13. AWS S3
14. Mongo Atlas
15. Localtunnel
16. AWS CloudFront

# How it works

**Downloading and processing video :**
1. If a video is already available, place it in the main folder or download a video from YouTube(Y2 downloader or In-House application)
2. Run the dividevideo.py to split the video into frames at random intervals between 2-5 seconds (considering 30 fps)
3. The divided frames will be available in the Dividedframes folder

**Annotation System :**
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

**To migrate the application to cloud, please check DeploymentReadme**

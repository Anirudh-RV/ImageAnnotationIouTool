Resources :
https://docs.docker.com/docker-for-mac/
https://docs.docker.com/compose/gettingstarted/
https://medium.com/travis-on-docker/how-to-dockerize-your-go-golang-app-542af15c27a2
https://hostadvice.com/how-to/how-to-use-docker-containers-with-aws-ec2/
https://medium.com/fredwong-it/aws-cloudfront-url-return-accessdenied-in-front-of-s3-react-app-a4bad7d3e4f2

# AWS COMMANDS
<br />**Important :**
<br />
update atlas with the public IP of Go API for Permissions
<br />
**S3 - ReactJS Always set up with CloudFront for URL redirecting**
1. Create bucket
2. Allow public access
3. Change bucket policy to : (Permissions/bucketpolicy)<br />
{<br />
&nbsp;&nbsp;  "Version": "2012-10-17",<br />
&nbsp;&nbsp;"Statement":[<br />
&nbsp;&nbsp;{<br />
&nbsp;&nbsp;&nbsp;"Sid":"AddPerm",<br />
&nbsp;&nbsp;&nbsp;      "Effect":"Allow",<br />
&nbsp;&nbsp;&nbsp;      "Principal": "\*",<br />
&nbsp;&nbsp;&nbsp;      "Action":["s3:GetObject"],<br />
&nbsp;&nbsp;&nbsp;      "Resource":["arn:aws:s3:::\<BUCKET-NAME\>/\*"]<br />
&nbsp;&nbsp;    }<br />
&nbsp;  ]<br />
}<br />

<br />
**NOTE :**
<br />
The \ in the bucket policy is ignored before asterisk and angle brackets of BUCKET-NAME
<br />
4. build the static website : Change all the urls according to the EC2 instances
npm run build
<br />
5. Copy and paste the contents of build/ into S3
<br />
6. Check the index.html file for Link
<br />
**ERRORS**
1. Problem with refreshing error occurs (ADD ROUTES WITH CLOUDFRONT)
<br />
2. Problem with downloading files (Stop ADBLOCK ON WEBSITE)

To run : **Update atlas with the public key for Permissions**
1. ssh -i reactjs.pem ec2-user@54.175.125.107
2. sudo service docker start
3. docker run -p 80:3000 anirudhrv1234/reactjs


**CloudFront**
// surveillancesystembmsce

1. Setup a user using the CloudFront serivce
2. Set the origin domain name as : 1bm16cs016react.s3.amazonaws.com
3. Set the origin path : /https://1bm16cs016react.s3.amazonaws.com/index.html
4. Click create
5. Select the ID and go to Error pages
6. Click create custom error response
7. For error code 403-Access Denied, let the response page be /index.html with response code 200-OK
8. Click okay
9. Click the ID again and find the CloudFront URL-Domain Name (General section):
Ex: d3sn2yu94s8xdo.cloudfront.net

The solution is go to Cloud front -> Select you cloud distribution detail -> select tab General -> Select edit -> In this form Setup the property Default Root Object to index.html

**EC2 - GO API IP:GET IP WHEN INSTANCE IS RUNNING**
1. Create an EC2 instance and allow HTTP:80 connections in the security options
2. chmod 400 goapikey.pem
3. ssh -i goapikey.pem ec2-user@<IP-Address>
4. sudo yum update -y
5. sudo yum install -y docker
6. sudo service docker start
7. sudo usermod -a -G docker ec2-user
8. exit
9. ssh -i goapikey.pem ec2-user@54.197.42.159
10. docker run -p 80:8080 anirudhrv1234/goapi

To run : **Update atlas with the public key for Permissions**
1. ssh -i goapikey.pem ec2-user@34.227.160.149
2. sudo service docker start
3. docker run -p 80:8080 anirudhrv1234/goapi

**EC2 - NodeServer IP: GET IP WHEN INSTANCE IS RUNNING**
1. Create an EC2 instance and allow HTTP:80 connections in the security options
2. chmod 400 Detectanamolyoutputvideo.pem
3. ssh -i Detectanamolyoutputvideo.pem ec2-user@<IP-Address>
4. sudo yum update -y
5. sudo yum install -y docker
6. sudo service docker start
7. sudo usermod -a -G docker ec2-user
8. exit
9. ssh -i Detectanamolyoutputvideo.pem ec2-user@<IP-Address>
10. docker run -p 80:4000 anirudhrv1234/nodeserver

To run :
1. ssh -i Detectanamolyoutputvideo.pem ec2-user@52.204.217.170
2. sudo service docker start
3. docker run -p 80:4000 anirudhrv1234/nodeserver

# For localtunnel (Making local server port publicly avaiable):
1. brew install ruby
2. echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.bash_profile
3. gem install localtunnel
4. lt -h "http://serverless.social" -p <port number>
5. Update the allowed hosts in Django before running

To run:
1. lt -h "http://serverless.social" -p <port number>
2. Update Django server allowed hosts in setting.py

# DOCKER
**RUN THE DOCKER COMMAND TO RUN CONTAINER**

**Important**
1. Always push to dockerhub - docker push UserName/ProjectName
1. Try using nginx for serving static folder

**Important**
1. docker stop CONTAINERID

2. lsof -P | grep ':80' | awk '{print $2}' | xargs kill -9

3. Problem with API_Go : Until a static IP Address for the mongodb server is not found, for each system
the user has to build the API_Go container by changing the IP Address to their Computer IP in
  a. HandleUsers/UserFunc.go
  b. HandleImages/ImageFunc.go
  (Problem solved by migrating mongodb to cloud)

**To run from docker  :(Build Inside respective folders)**
1. 1. To build: docker build -t **-Name-** .


**Start MongoDB**
Using Mongo Atlas for cloud monogoDB
1. https://cloud.mongodb.com/v2/5e900ec2a7d1747f28c16087#metrics/replicaSet/5e900fc72e84e918f3bbb59c/explorer/GoDB/UserData/find
1. Local: docker run -d -p 27017-27019:27017-27019 --name mongodb mongo

cd74ed0cd946717155f47b95bcd85bcc8371a561a8f672c8e2506555c20d8ac4
*if error occurs saying container already running*

1. Local: docker run -d -p 27017-27019:27017-27019 --name CONTAINER ID mongo

2. Important : Make sure mongo is running on <ip-address>:27017 before running GO API

**To run GO API**
1. To build: docker build -t anirudhrv1234/goapi .

2. Remote: docker run --rm -it -p 80:8080 anirudhrv1234/goapi

3. Local: docker run --rm -p 8080:8080 anirudhrv1234/goapi

**To run NodeServer (Node JS)** RUNNING ON AWS CURRENTLY
1. To build: docker build -t anirudhrv/nodeserver .

2. Local: docker run -p 80:4000 anirudhrv1234/nodeserver

**To run Client (React JS)**
1. To build: docker build -t anirudhrv1234/reactjs .

2. Local: docker run -p 80:3000 anirudhrv1234/reactjs

**Commands to run a Docker app (GENERAL):**

**To make directory :**
1. mkdir test
2. cd test

**To make the app :**
1. touch myapp.py
2. open myapp.py
3. -Copy & Paste the required code

**To define the requirements/dependencies :**
1. touch requirements.txt
2. open requirements.txt
3. -Copy & Paste the required dependencies

**To create Dockerfile**
1. touch Dockerfile
2. open Dockerfile
3. -Copy & Paste the system configuration

**To create docker-compose.yml**
1. touch docker-compose.yml
2. open docker-compose.yml
3. -Copy & Paste the required configuration

**Run the App**
1. docker-compose up

**To delete images**
1. docker system prune

<br />
**RAW**
PublicReadForGetBucketObjects
{
   "Version": "2012-10-17",
  "Statement":[
  {
   "Sid":"AddPerm",
    "Effect":"Allow",
    "Principal": "*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::<BUCKET-NAME>/*"]
   }
  ]
}

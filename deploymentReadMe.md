# Deployment steps
NOTE: Run 4 different containers to get links in advance
1. When deploying the website using AWS or other cloud services, configure the components to the
particular URLs
2. Change Mongo Atlas allowed hosts to the Go API url (Mongo Atlas cloud Api)
3. Change the Go Api url to the Mongo Atlas Api Url and build image and deploy container (EC2)
4. Deploy Node Server with the container (No changes needed for node server) (EC2)
5. Change the links in the jsonData in the WebApp to access the cloud deployed Api's, run build and deploy on S3
6. Change the allowed hosts in django and build the image and deploy the container (EC2)

# AWS COMMANDS
**S3 - ReactJS set up with CloudFront for URL redirecting**
1. Create bucket
2. Allow public access
3. Change bucket policy to : (Permissions/bucketpolicy) : Please check file-bucketpolicy
4. build the static website : Change all the urls according to the EC2 instances :npm run build
5. Copy and paste the contents of build/ into S3
6. Check the index.html file for Link

**To run : WebApp on EC2**
1. ssh -i CreatedKey.pem ec2-user@IP-Address
2. sudo service docker start
3. docker run -p 80:3000 dockeruser/dockercontainer

**CloudFront**
1. Setup a user using the CloudFront serivce
2. Set the origin domain name as : bucketname.s3.amazonaws.com
3. Set the origin path : https://bucketname.s3.amazonaws.com/index.html
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
2. chmod 400 authenticationkey.pem
3. ssh -i authenticationkey.pem ec2-user@Ip-Address
4. sudo yum update -y
5. sudo yum install -y docker
6. sudo service docker start
7. sudo usermod -a -G docker ec2-user
8. exit
9. ssh -i authenticationkey.pem ec2-user@Ip-Address
10. docker run -p 80:8080 dockeruser/dockercontainer
*Important :*
update atlas with the public IP of Go API for Permissions

**EC2 - NodeServer IP: GET IP WHEN INSTANCE IS RUNNING**
1. Create an EC2 instance and allow HTTP:80 connections in the security options
2. chmod 400 authenticationkey.pem
3. ssh -i authenticationkey.pem ec2-user@Ip-Address
4. sudo yum update -y
5. sudo yum install -y docker
6. sudo service docker start
7. sudo usermod -a -G docker ec2-user
8. exit
9. ssh -i authenticationkey.pem ec2-user@Ip-Address
10. docker run -p 80:4000 dockeruser/dockercontainer

**EC2 - Django API IP:GET IP WHEN INSTANCE IS RUNNING**

1. Create an EC2 instance and allow HTTP:80 connections in the security options
2. chmod 400 authenticationkey.pem
3. ssh -i authenticationkey.pem ec2-user@Ip-Address
4. sudo yum update -y
5. sudo yum install -y docker
6. sudo service docker start
7. sudo usermod -a -G docker ec2-user
8. exit
9. ssh -i authenticationkey.pem ec2-user@Ip-Address
10. docker run -p 80:8080 dockeruser/dockercontainer

**To run :**
1. ssh -i authenticationkey.pem ec2-user@Ip-Address
2. sudo service docker start
3. docker run -p 80:4000 dockeruser/dockercontainer

**For localtunnel (Making local server port publicly avaiable):**
1. brew install ruby
2. echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.bash_profile
3. gem install localtunnel
4. lt -h "http://serverless.social" -p <port number>
5. Update the allowed hosts in Django before running

**To run :**
1. lt -h "http://serverless.social" -p <port number>
2. Update Django server allowed hosts in setting.py

# DOCKER
**RUN THE DOCKER COMMAND TO RUN CONTAINER**

**Important**
1. Always push to dockerhub - docker push UserName/ProjectName
1. Try using nginx for serving static folder

**To run from docker  :(Build Inside respective folders)**
1. 1. To build: docker build -t **-Name-** .

**Start MongoDB**
Use Mongo Atlas for cloud monogoDB

**To run GO API**
1. To build: docker build -t dockeruser/dockercontainer .

2. Remote: docker run --rm -it -p 80:8080 dockeruser/dockercontainer

3. Local: docker run --rm -p 8080:8080 dockeruser/dockercontainer

**To run NodeServer (Node JS)**
1. To build: docker build -t dockeruser/dockercontainer .

2. Local: docker run -p 80:4000 dockeruser/dockercontainer

**To run Client (React JS)**
1. To build: docker build -t dockeruser/dockercontainer .

2. Local: docker run -p 80:3000 dockeruser/dockercontainer

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

**To delete all images**
1. docker system prune

**To stop an image**
1. docker stop CONTAINER_ID_NAMES

# Resources :
1. https://docs.docker.com/docker-for-mac/
2. https://docs.docker.com/compose/gettingstarted/
3. https://medium.com/travis-on-docker/how-to-dockerize-your-go-golang-app-542af15c27a2
4. https://hostadvice.com/how-to/how-to-use-docker-containers-with-aws-ec2/
5. https://medium.com/fredwong-it/aws-cloudfront-url-return-accessdenied-in-front-of-s3-react-app-a4bad7d3e4f2
